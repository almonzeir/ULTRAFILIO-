# **App Name**: UltraFolio

## Core Features:

- CV/Resume Parsing: Automatically parse and extract data from uploaded CV/resume (PDF/DOCX) files or structured form input to populate the portfolio.
- Live Portfolio Editor: Enable drag-and-drop reordering of sections, inline text editing, template switching, and theme customization with real-time previews.
- Apple-Style Templates: Offer a selection of premium Apple-style templates (Modern, Minimalist, Basic) with customizable colors and fonts within defined constraints.
- Bilingual Support (EN/AR): Implement internationalization with RTL support for Arabic, allowing users to create portfolios in both English and Arabic.
- Device Mockup Generation: Automatically place the generated portfolio into device mockups to allow the user to get an understanding of what their portfolio will look like across multiple devices. Incorporate a tool that uses generative AI to find stock images, and if the LLM identifies the device to be too out of date, it can fetch newer replacements from online and incorporate it into the users presentation. The user can review each of these LLM generated images before saving or incorporating.
- One-Click Deployment: Enable one-click deployment to Netlify with a public URL and GitHub repository creation.
- Premium Download Code (ZIP): Offer a premium feature to download the portfolio as a static Next.js site bundle (ZIP).

## Style Guidelines:

- Primary color: Accent blue (#0A84FF) will be sparingly used only for focus states and links, preserving the high-contrast black and white foundation.
- Background color: Pure white (#FFFFFF) for the light theme and off-black (#0B0B0B) for the dark theme to maintain a monochrome aesthetic.
- Accent color: Light gray (#F5F5F5) as the default 'surface' color for light theme cards. Dark gray (#111111) as the default 'surface' color for dark theme cards.
- Body and headline font: '-apple-system, BlinkMacSystemFont, Segoe UI, Inter, Helvetica, Arial' for a clean, system-native look. Note: currently only Google Fonts are supported.
- Utilize a symmetric 12-column grid layout with generous padding and whitespace for a balanced and spacious design.
- Implement a split-tone hero section (half black / half white) and a sticky glass navbar with blur for a modern touch.
- Use Framer Motion for smooth fade/slide/parallax effects at 60fps, ensuring animations are subtle and enhance the user experience without being gratuitous.