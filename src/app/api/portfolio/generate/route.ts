
const portfolioDataSchema = `
type PortfolioData = {
  personalInfo: {
    fullName: string;
    title?: string;
    tagline?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedInURL?: string;
    githubURL?: string;
    portfolioNameAbbr?: string; // e.g. "OS"
    profilePhotoURL?: string;   // from upload
  };
  about: {
    extendedBio?: string;
    stats?: Array<{ label: string; value: string; icon?: string }>;
    skills?: Array<{ category: string; icon?: string; tags: string[] }>;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    dates?: string;                 // normalize to "YYYY-MM – YYYY-MM" or "YYYY-MM – Present"
    responsibilities: string[];     // 3–6 impact bullets
    tags?: string[];                // skills/tech highlights
  }>;
  projects: Array<{
    name: string;
    category?: string;
    description?: string;
    tags: string[];
    imageURL?: string;              // placeholder allowed
    detailsURL?: string;
  }>;
  education?: Array<{
    degree: string;
    field?: string;
    institution: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
  }>;
  certifications?: string[];
  awards?: string[];
  languages?: Array<{ name: string; level?: string }>;
  interests?: string[];
};
`;

const SYSTEM_PROMPT = `
You are an expert CV to Portfolio data extractor. Your task is to parse a resume file and output a strictly valid JSON object matching the "PortfolioData" schema provided.

**Rules:**
- Derive impact-focused bullets for experience (3–6 per role).
- Normalize dates to "YYYY-MM – YYYY-MM" or "YYYY-MM – Present".
- Deduplicate skills and group them by category where obvious.
- Use empty arrays for unknown lists; omit null or undefined properties.
- NEVER include commentary, markdown, or any text outside of the JSON object. Your entire output must be a single, valid JSON.
- If a field is not present in the CV, omit it from the JSON.
- Generate a 
`portfolioNameAbbr`
 from the user's initials (e.g., "Jane Doe" -> "JD").
`;

async function uploadFileToFirebase(file: File, userId: string): Promise<string> {
    const storageRef = ref(storage, `uploads/${userId}/${uuidv4()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cvFile = formData.get('cv') as File | null;
    const photoFile = formData.get('photo') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!cvFile) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // 1. Convert CV file to a data URL to pass to Gemini
    const cvArrayBuffer = await cvFile.arrayBuffer();
    const cvBase64 = Buffer.from(cvArrayBuffer).toString('base64');

    // 2. Prepare prompt for Gemini
    const userPrompt = `
      SCHEMA (TypeScript): ${portfolioDataSchema}

      TASK:
      1) Parse the resume file provided.
      2) Fill the PortfolioData JSON schema with the extracted and normalized fields.
      3) Create concise, action-led bullets with metrics if present.
      4) Extract links (LinkedIn, GitHub, website) if they exist.

      RETURN: Valid JSON of PortfolioData only.
    `;

    const model = google('models/gemini-1.5-flash-latest');
    
    // 3. Call Gemini
    const { text } = await streamText({
      model: model,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      attachments: [
        {
          contentType: cvFile.type,
          content: cvBase64,
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    let jsonString = '';
    const reader = text.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        jsonString += value;
    }

    let parsedData = JSON.parse(jsonString) as PortfolioData;

    // 4. Handle photo upload
    let photoURL = '';
    if (photoFile) {
      photoURL = await uploadFileToFirebase(photoFile, userId);
    }
    
    // 5. Normalize and enrich data
    if (parsedData.personalInfo) {
      parsedData.personalInfo.profilePhotoURL = photoURL;
      if (parsedData.personalInfo.fullName && !parsedData.personalInfo.portfolioNameAbbr) {
        parsedData.personalInfo.portfolioNameAbbr = parsedData.personalInfo.fullName
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();
      }
    }

    // 6. Save to Firestore
    const portfolioId = uuidv4();
    const portfolioRef = doc(db, 'portfolios', portfolioId);

    await setDoc(portfolioRef, {
      ...parsedData,
      userId: userId,
      createdAt: serverTimestamp(),
      originalCvUrl: await uploadFileToFirebase(cvFile, userId), // Also save the original CV
    });

    return NextResponse.json({ portfolioId: portfolioId });

  } catch (error: any) {
    console.error('Error in generate portfolio route:', error);
    let errorMessage = 'Failed to generate portfolio with AI model.';
    if (error.message.includes('API key')) {
        errorMessage = 'AI API key is not configured correctly.'
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
