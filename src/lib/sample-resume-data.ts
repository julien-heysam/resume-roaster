import { ResumeData } from './resume-templates'

export const julienWuthrichSampleData: ResumeData = {
  personalInfo: {
    name: "Julien Wuthrich",
    email: "julien.wut@gmail.com",
    phone: "415-430-8779",
    location: "San Francisco",
    linkedin: "https://linkedin.com/in/julien-wuthrich",
    github: "https://github.com/Jwuthri",
    portfolio: "",
    jobTitle: "AI Strategy Advisor",
    jobDescription: "AI Strategy Advisor and Machine Learning Engineer"
  },
  summary: "Experienced AI Strategy Advisor and Machine Learning Engineer with expertise in developing scalable AI solutions, leading cross-functional teams, and implementing strategic AI initiatives across various industries.",
  experience: [
    {
      title: "Founding Engineer",
      company: "Heysam",
      location: "San Mateo, CA",
      startDate: "June 2023",
      endDate: "Today",
      description: [
        "Building AI Sales Engineer assistant that integrates into Zoom calls and Slack to answer technical product questions in real-time.",
        "Fine-tuning large language models (LLMs) for video analysis and video call intelligence.",
        "Developed domain-specific pipelines and prompt-engineering strategies for production-quality inference.",
        "Designed scalable back-end systems for real-time model inference and data collection in Python."
      ],
      achievements: []
    },
    {
      title: "AI Strategy Advisor",
      company: "Various Startups (Consulting)",
      location: "San Francisco, CA",
      startDate: "Dec 2023",
      endDate: "Present",
      description: [
        "Designed and implemented AI transformation roadmaps for 4+ early-stage startups, reducing operational costs",
        "Developed custom GPT-based workflow automation solutions that eliminated 15-20 hours of weekly manual work for client teams across marketing, customer support, and content creation",
        "Advised on strategic implementation of computer vision systems for a retail analytics startup, resulting in improving inventory management",
        "Created AI readiness assessment framework to identify high-impact, low-implementation-cost opportunities, prioritizing initiatives with measurable ROI"
      ],
      achievements: []
    },
    {
      title: "Machine Learning Engineer",
      company: "Gorgias",
      location: "San Francisco, CA",
      startDate: "Sept 2019",
      endDate: "Aug 2023",
      description: [
        "Led development of high-performance ML microservices handling millions of daily queries with sub-100ms latency for a customer support platform.",
        "Architected and deployed multilingual NLP models for sentiment analysis and intent detection, increasing automated response accuracy by 37%",
        "Implemented text summarization and named entity recognition models specialized for e-commerce, reducing support agent resolution time by 42%",
        "Designed scalable machine translation pipeline based on marian-mt models supporting 12+ languages for international customer communications",
        "Optimized model inference through techniques like quantization and KD-Tree algorithms, reducing infrastructure costs by 23% while maintaining accuracy",
        "Developed and maintained an English/French next-word prediction system with 250ms response time, improving agent typing efficiency by 38%"
      ],
      achievements: []
    },
    {
      title: "Data Scientist",
      company: "Renault Digital",
      location: "Boulogne-Billancourt, France",
      startDate: "",
      endDate: "",
      description: [],
      achievements: []
    }
  ],
  education: [
    {
      degree: "M.S in Computer Science",
      school: "University Polytechnique Haut-de-France",
      location: "",
      graduationDate: "Sept 2010 – May 2015",
      gpa: "3.9/4.0",
      honors: ["Graph Theory", "Big Data", "Qlearning"]
    }
  ],
  skills: {
    technical: [
      "Python", "JavaScript",
      "Postgres", "AWS", "GCP", "Docker", "Apache Spark", "Data Beam", "Terraform",
      "TensorFlow", "PyTorch", "Scikit-learn", "Hugging-face"
    ],
    soft: [
      "Leadership", "Strategic Planning", "Cross-functional Collaboration", "Technical Communication"
    ],
    languages: ["English", "French"],
    certifications: []
  },
  projects: [
    {
      name: "AI Sales Assistant",
      description: "Real-time AI assistant for technical sales calls with Zoom and Slack integration",
      technologies: ["Python", "TensorFlow", "Zoom API", "Slack API", "Docker"],
      link: ""
    },
    {
      name: "Multilingual Customer Support AI",
      description: "NLP pipeline for automated customer support in 12+ languages",
      technologies: ["PyTorch", "Hugging-face", "Docker", "Kubernetes", "PostgreSQL"],
      link: ""
    }
  ]
} 