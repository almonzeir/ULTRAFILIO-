import type { PortfolioData } from '@/templates/types';

/**
 * Sample portfolio data for testing WITHOUT AI
 * Use this to test templates instantly!
 */
export const SAMPLE_PORTFOLIO_DATA: PortfolioData = {
    personalInfo: {
        fullName: "Alex Johnson",
        title: "Full Stack Developer & UI/UX Designer",
        tagline: "Building beautiful, scalable web applications that users love",
        email: "alex.johnson@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "https://alexjohnson.dev",
        linkedInURL: "https://linkedin.com/in/alexjohnson",
        githubURL: "https://github.com/alexjohnson",
        portfolioNameAbbr: "AJ",
        profilePhotoURL: "https://i.pravatar.cc/400?img=33"
    },
    about: {
        extendedBio: "Passionate full-stack developer with 5+ years of experience building modern web applications. I specialize in React, Node.js, and cloud architecture. I love creating intuitive user experiences backed by robust, scalable systems.",
        stats: [
            { label: "Years Experience", value: "5+", icon: "⏱️" },
            { label: "Projects Completed", value: "50+", icon: "🚀" },
            { label: "Happy Clients", value: "30+", icon: "😊" },
            { label: "GitHub Stars", value: "1.2k", icon: "⭐" }
        ],
        skills: [
            {
                category: "Frontend",
                icon: "💻",
                tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"]
            },
            {
                category: "Backend",
                icon: "⚙️",
                tags: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"]
            },
            {
                category: "DevOps & Tools",
                icon: "🔧",
                tags: ["Docker", "AWS", "GitHub Actions", "Vercel", "Supabase"]
            }
        ]
    },
    experience: [
        {
            jobTitle: "Senior Full Stack Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            dates: "2021-06 – Present",
            responsibilities: [
                "Led development of a SaaS platform serving 10,000+ users, increasing revenue by 40%",
                "Architected microservices infrastructure reducing deployment time by 60%",
                "Mentored team of 5 junior developers, improving code quality metrics by 35%",
                "Implemented CI/CD pipeline reducing bugs in production by 50%"
            ],
            tags: ["React", "Node.js", "AWS", "PostgreSQL", "TypeScript"]
        },
        {
            jobTitle: "Full Stack Developer",
            company: "StartupXYZ",
            location: "Remote",
            dates: "2019-03 – 2021-05",
            responsibilities: [
                "Built MVP that secured $2M in seed funding within 6 months",
                "Developed real-time analytics dashboard processing 1M+ events daily",
                "Optimized database queries reducing load times by 70%",
                "Collaborated with design team to implement pixel-perfect UI/UX"
            ],
            tags: ["Vue.js", "Express", "MongoDB", "Redis"]
        },
        {
            jobTitle: "Frontend Developer",
            company: "Digital Agency LLC",
            location: "New York, NY",
            dates: "2017-08 – 2019-02",
            responsibilities: [
                "Created responsive websites for 15+ clients across various industries",
                "Implemented accessibility standards achieving WCAG AA compliance",
                "Reduced page load times by 40% through optimization techniques",
                "Trained team on modern JavaScript frameworks and best practices"
            ],
            tags: ["JavaScript", "React", "SASS", "Webpack"]
        }
    ],
    projects: [
        {
            name: "TaskMaster Pro",
            category: "Web Application",
            description: "A collaborative project management tool with real-time updates, Kanban boards, and team analytics. Used by 5,000+ teams worldwide.",
            tags: ["Next.js", "Supabase", "WebSockets", "Tailwind"],
            imageURL: "https://placehold.co/600x400/6366f1/white?text=TaskMaster+Pro",
            detailsURL: "https://github.com/alexjohnson/taskmaster"
        },
        {
            name: "AI Content Generator",
            category: "AI Tool",
            description: "An AI-powered content creation platform that generates blog posts, social media content, and marketing copy using GPT-4.",
            tags: ["React", "OpenAI", "Node.js", "PostgreSQL"],
            imageURL: "https://placehold.co/600x400/8b5cf6/white?text=AI+Generator",
            detailsURL: "https://github.com/alexjohnson/ai-content"
        },
        {
            name: "E-Commerce Dashboard",
            category: "SaaS Platform",
            description: "An analytics dashboard for e-commerce businesses with real-time sales tracking, inventory management, and customer insights.",
            tags: ["Vue.js", "Chart.js", "Firebase", "Stripe"],
            imageURL: "https://placehold.co/600x400/ec4899/white?text=Dashboard",
            detailsURL: "https://github.com/alexjohnson/ecom-dash"
        },
        {
            name: "Fitness Tracker App",
            category: "Mobile App",
            description: "A React Native fitness app with workout tracking, nutrition logging, and social features. 10k+ downloads on App Store.",
            tags: ["React Native", "Expo", "MongoDB", "AWS"],
            imageURL: "https://placehold.co/600x400/10b981/white?text=Fitness+App",
            detailsURL: "https://github.com/alexjohnson/fitness-tracker"
        },
        {
            name: "Real Estate Platform",
            category: "Marketplace",
            description: "A property listing platform with advanced search, virtual tours, and integrated messaging system for buyers and sellers.",
            tags: ["Next.js", "Mapbox", "PostgreSQL", "S3"],
            imageURL: "https://placehold.co/600x400/f59e0b/white?text=Real+Estate",
            detailsURL: "https://github.com/alexjohnson/real-estate"
        },
        {
            name: "Developer Portfolio Builder",
            category: "Tool",
            description: "A drag-and-drop portfolio builder for developers with customizable themes, analytics, and SEO optimization.",
            tags: ["React", "TypeScript", "Vercel", "TailwindCSS"],
            imageURL: "https://placehold.co/600x400/3b82f6/white?text=Portfolio+Builder",
            detailsURL: "https://github.com/alexjohnson/portfolio-builder"
        }
    ],
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            field: "Computer Science",
            institution: "University of California, Berkeley",
            startDate: "2013",
            endDate: "2017",
            notes: "GPA: 3.8/4.0, Dean's List, Focus on Software Engineering and AI"
        }
    ],
    certifications: [
        "AWS Certified Solutions Architect - Associate (2022)",
        "Google Cloud Professional Developer (2021)",
        "Meta Front-End Developer Professional Certificate (2020)"
    ],
    awards: [
        "Best Innovation Award - TechCorp Hackathon 2023",
        "Employee of the Year - StartupXYZ 2020"
    ],
    languages: [
        { name: "English", level: "Native" },
        { name: "Spanish", level: "Intermediate" },
        { name: "Mandarin", level: "Beginner" }
    ],
    interests: [
        "Open Source Contribution",
        "Tech Blogging",
        "Photography",
        "Rock Climbing",
        "Teaching & Mentoring"
    ]
};
