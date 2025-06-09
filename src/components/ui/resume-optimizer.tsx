"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { Textarea } from "./textarea"
import { Input } from "./input"
import { Label } from "./label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { useAlertDialog } from "./alert-dialog"
import { AnalysisLoading } from "./analysis-loading"
import { ResumeOptimizationLoading } from "./resume-optimizer-loading"
import { 
  FileText, 
  Download, 
  Eye, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Target,
  TrendingUp,
  Code,
  Briefcase,
  Crown,
  Palette,
  Home,
  ArrowLeft,
  User,
  Save,
  Edit3,
  RefreshCw
} from "lucide-react"
import { ResumeData } from "@/lib/resume-templates"
import { generatePDF, generateDOCX, downloadBlob } from "@/lib/document-generators"
// LaTeX templates removed - using HTML/CSS templates only
import { openInOverleafBase64 } from "@/lib/overleaf-integration"

interface Template {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'tech' | 'creative' | 'executive'
  atsOptimized: boolean
  type?: 'html' // Only HTML templates supported
}

interface OptimizedResumeResponse {
  resume: string
  format: 'html' | 'markdown'
  template: Template
  optimizations: {
    suggestions: string[]
    keywordsFound: string[]
    atsScore: number
  }
}

const categoryIcons = {
  modern: <Sparkles className="h-4 w-4" />,
  classic: <FileText className="h-4 w-4" />,
  tech: <Code className="h-4 w-4" />,
  creative: <Palette className="h-4 w-4" />,
  executive: <Crown className="h-4 w-4" />
}

const categoryColors = {
  modern: "bg-blue-50 border-blue-200 text-blue-700",
  classic: "bg-gray-50 border-gray-200 text-gray-700",
  tech: "bg-green-50 border-green-200 text-green-700",
  creative: "bg-purple-50 border-purple-200 text-purple-700",
  executive: "bg-amber-50 border-amber-200 text-amber-700"
}

// Sample data for template preview
const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/alexjohnson",
    portfolio: "https://alexjohnson.dev",
    github: "https://github.com/alexjohnson",
    jobTitle: "Software Engineer",
    jobDescription: "Experienced Software Engineer"
  },
  summary: "Experienced Software Engineer with 5+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact solutions that drive business growth.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      description: [
        "Led development of microservices architecture serving 1M+ users",
        "Mentored junior developers and established coding best practices"
      ],
      achievements: [
        "Reduced system latency by 40% through optimization initiatives",
        "Increased team productivity by 25% through process improvements"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of California",
      location: "Berkeley, CA",
      graduationDate: "2019",
      gpa: "3.8",
      honors: ["Magna Cum Laude"]
    }
  ],
  skills: {
    technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker"],
    soft: ["Leadership", "Problem-solving", "Communication", "Team Management"],
    languages: ["English", "Spanish"],
    certifications: ["AWS Certified Solutions Architect"]
  },
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://github.com/alexjohnson/ecommerce"
    }
  ]
}

// localStorage utilities for resume data - Updated to exclude job description
const RESUME_DATA_KEY = 'resume-optimizer-data'
// Remove JOB_DESCRIPTION_KEY since we don't want to save job descriptions

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

const loadFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

// User profile data interface - Updated to exclude jobDescription
interface UserProfile {
  personalInfo: Omit<ResumeData['personalInfo'], 'jobDescription'>
  summary?: string
  experience?: ResumeData['experience']
  education?: ResumeData['education']
  skills?: ResumeData['skills']
  projects?: ResumeData['projects']
  lastUpdated: string
}

export default function ResumeOptimizer() {
  const { data: session } = useSession()
  const router = useRouter()
  const { showAlert, AlertDialog } = useAlertDialog()
  
  // State for tracking if we came from analysis
  const [isFromAnalysis, setIsFromAnalysis] = useState(false)
  const [hasOptimizedData, setHasOptimizedData] = useState(false)
  
  // Resume data state
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      github: '',
      jobTitle: '',
      jobDescription: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: []
    },
    projects: []
  })
  
  const [jobDescription, setJobDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('your-resume-style')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedResult, setOptimizedResult] = useState<OptimizedResumeResponse | null>(null)
  const [profileDataLoaded, setProfileDataLoaded] = useState(false)

  // Load profile data on component mount
  useEffect(() => {
    // First, check if we have prefilled data from the analysis page
    const urlParams = new URLSearchParams(window.location.search)
    const isPrefilled = urlParams.get('prefilled') === 'true'
    
    if (isPrefilled) {
      try {
        // Load optimized resume data from session storage (new format)
        const optimizedResumeData = sessionStorage.getItem('optimizedResumeData')
        // Also check for legacy extractedResumeData for backward compatibility
        const extractedResumeData = sessionStorage.getItem('extractedResumeData')
        const resumeDataToUse = optimizedResumeData || extractedResumeData
        
        const analysisJobDescription = sessionStorage.getItem('analysisJobDescription')
        const isFromAnalysisFlag = sessionStorage.getItem('isFromAnalysis') === 'true'
        const dataTimestamp = sessionStorage.getItem('optimizedDataTimestamp') || sessionStorage.getItem('extractedDataTimestamp')
        
        // Set the analysis state
        setIsFromAnalysis(isFromAnalysisFlag)
        setHasOptimizedData(!!resumeDataToUse)
        
        if (resumeDataToUse) {
          const parsedData = JSON.parse(resumeDataToUse)
          console.log('Loading prefilled resume data:', parsedData)
          
          // If this is fresh data from analysis, use it directly and update localStorage
          if (isFromAnalysisFlag) {
            console.log('Fresh data from analysis - using optimized data and updating cache')
            
            // Pre-fill the form with extracted data, ensuring proper structure
            const newResumeData = {
              personalInfo: {
                name: parsedData.personalInfo?.name || '',
                email: parsedData.personalInfo?.email || '',
                phone: parsedData.personalInfo?.phone || '',
                location: parsedData.personalInfo?.location || '',
                linkedin: parsedData.personalInfo?.linkedin || '',
                portfolio: parsedData.personalInfo?.portfolio || '',
                github: parsedData.personalInfo?.github || '',
                jobTitle: parsedData.personalInfo?.jobTitle || '',
                jobDescription: '' // Always start with empty job description
              },
              summary: parsedData.summary || '',
              experience: Array.isArray(parsedData.experience) ? parsedData.experience.map((exp: any) => ({
                title: exp.title || '',
                company: exp.company || '',
                location: exp.location || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                description: Array.isArray(exp.description) ? exp.description : [],
                achievements: Array.isArray(exp.achievements) ? exp.achievements : []
              })) : [],
              education: Array.isArray(parsedData.education) ? parsedData.education.map((edu: any) => ({
                degree: edu.degree || '',
                school: edu.school || '',
                location: edu.location || '',
                graduationDate: edu.graduationDate || '',
                gpa: edu.gpa || '',
                honors: Array.isArray(edu.honors) ? edu.honors : []
              })) : [],
              skills: {
                technical: (Array.isArray(parsedData.skills?.technical) && parsedData.skills.technical.length > 0) 
                  ? parsedData.skills.technical 
                  : [],
                soft: (Array.isArray(parsedData.skills?.soft) && parsedData.skills.soft.length > 0)
                  ? parsedData.skills.soft
                  : [],
                languages: (Array.isArray(parsedData.skills?.languages) && parsedData.skills.languages.length > 0)
                  ? parsedData.skills.languages
                  : [],
                certifications: (Array.isArray(parsedData.skills?.certifications) && parsedData.skills.certifications.length > 0)
                  ? parsedData.skills.certifications
                  : []
              },
              projects: (Array.isArray(parsedData.projects) && parsedData.projects.length > 0)
                ? parsedData.projects.map((proj: any) => ({
                    name: proj.name || '',
                    description: proj.description || '',
                    technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
                    link: proj.link || ''
                  }))
                : []
            }
            
            setResumeData(newResumeData)
            
            // Save to localStorage for future use
            saveToLocalStorage(RESUME_DATA_KEY, newResumeData)
            console.log('Updated localStorage with fresh extracted data')
            
          } else {
            // This is cached data, merge with existing localStorage data
            console.log('Using cached extracted data, merging with localStorage')
            
            const savedProfile = loadFromLocalStorage(RESUME_DATA_KEY)
            const mergedData = {
              personalInfo: {
                name: parsedData.personalInfo?.name || savedProfile?.personalInfo?.name || '',
                email: parsedData.personalInfo?.email || savedProfile?.personalInfo?.email || '',
                phone: parsedData.personalInfo?.phone || savedProfile?.personalInfo?.phone || '',
                location: parsedData.personalInfo?.location || savedProfile?.personalInfo?.location || '',
                linkedin: parsedData.personalInfo?.linkedin || savedProfile?.personalInfo?.linkedin || '',
                portfolio: parsedData.personalInfo?.portfolio || savedProfile?.personalInfo?.portfolio || '',
                github: parsedData.personalInfo?.github || savedProfile?.personalInfo?.github || '',
                jobTitle: parsedData.personalInfo?.jobTitle || savedProfile?.personalInfo?.jobTitle || '',
                jobDescription: ''
              },
              summary: parsedData.summary || savedProfile?.summary || '',
              experience: (Array.isArray(parsedData.experience) && parsedData.experience.length > 0) 
                ? parsedData.experience.map((exp: any) => ({
                    title: exp.title || '',
                    company: exp.company || '',
                    location: exp.location || '',
                    startDate: exp.startDate || '',
                    endDate: exp.endDate || '',
                    description: Array.isArray(exp.description) ? exp.description : [],
                    achievements: Array.isArray(exp.achievements) ? exp.achievements : []
                  }))
                : savedProfile?.experience || [],
              education: (Array.isArray(parsedData.education) && parsedData.education.length > 0)
                ? parsedData.education.map((edu: any) => ({
                    degree: edu.degree || '',
                    school: edu.school || '',
                    location: edu.location || '',
                    graduationDate: edu.graduationDate || '',
                    gpa: edu.gpa || '',
                    honors: Array.isArray(edu.honors) ? edu.honors : []
                  }))
                : savedProfile?.education || [],
              skills: {
                technical: (Array.isArray(parsedData.skills?.technical) && parsedData.skills.technical.length > 0) 
                  ? parsedData.skills.technical 
                  : savedProfile?.skills?.technical || [],
                soft: (Array.isArray(parsedData.skills?.soft) && parsedData.skills.soft.length > 0)
                  ? parsedData.skills.soft
                  : savedProfile?.skills?.soft || [],
                languages: (Array.isArray(parsedData.skills?.languages) && parsedData.skills.languages.length > 0)
                  ? parsedData.skills.languages
                  : savedProfile?.skills?.languages || [],
                certifications: (Array.isArray(parsedData.skills?.certifications) && parsedData.skills.certifications.length > 0)
                  ? parsedData.skills.certifications
                  : savedProfile?.skills?.certifications || []
              },
              projects: (Array.isArray(parsedData.projects) && parsedData.projects.length > 0)
                ? parsedData.projects.map((proj: any) => ({
                    name: proj.name || '',
                    description: proj.description || '',
                    technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
                    link: proj.link || ''
                  }))
                : savedProfile?.projects || []
            }
            
            setResumeData(mergedData)
            setProfileDataLoaded(true)
          }
          
          // Also set the job description if available
          if (analysisJobDescription) {
            setJobDescription(analysisJobDescription)
          }
          
          // Clean up session storage after loading
          sessionStorage.removeItem('optimizedResumeData')
          sessionStorage.removeItem('extractedResumeData') // Legacy cleanup
          sessionStorage.removeItem('analysisJobDescription')
          sessionStorage.removeItem('isFromAnalysis')
          sessionStorage.removeItem('optimizedDataTimestamp')
          sessionStorage.removeItem('extractedDataTimestamp') // Legacy cleanup
          
          // Remove the prefilled parameter from URL
          const newUrl = window.location.pathname
          window.history.replaceState({}, '', newUrl)
          
          console.log('Successfully loaded prefilled data from analysis')
          return // Exit early if we loaded prefilled data
        }
      } catch (error) {
        console.error('Failed to load prefilled data:', error)
      }
    }
    
    // If no prefilled data, load saved profile data
    const savedProfile = loadFromLocalStorage(RESUME_DATA_KEY)
    if (savedProfile) {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...savedProfile.personalInfo,
          jobDescription: '' // Always start with empty job description
        },
        summary: savedProfile.summary || '',
        experience: savedProfile.experience || [],
        education: savedProfile.education || [],
        skills: savedProfile.skills || prev.skills,
        projects: savedProfile.projects || []
      }))
      setProfileDataLoaded(true)
    }
  }, [])

  // Handle prefilled data from analysis page
  useEffect(() => {
    // Check if we have prefilled data from the analysis page
    const urlParams = new URLSearchParams(window.location.search)
    const isPrefilled = urlParams.get('prefilled') === 'true'
    
    if (isPrefilled) {
      try {
        // Load optimized resume data from session storage (new format)
        const optimizedResumeData = sessionStorage.getItem('optimizedResumeData')
        // Also check for legacy extractedResumeData for backward compatibility
        const extractedResumeData = sessionStorage.getItem('extractedResumeData')
        const resumeDataToUse = optimizedResumeData || extractedResumeData
        
        const analysisJobDescription = sessionStorage.getItem('analysisJobDescription')
        
        if (resumeDataToUse) {
          const parsedData = JSON.parse(resumeDataToUse)
          console.log('Loading prefilled resume data:', parsedData)
          
          // Pre-fill the form with extracted data
          setResumeData(parsedData)
          setProfileDataLoaded(true)
          
          // Also set the job description if available
          if (analysisJobDescription) {
            setJobDescription(analysisJobDescription)
          }
          
          // Clean up session storage after loading
          sessionStorage.removeItem('optimizedResumeData')
          sessionStorage.removeItem('extractedResumeData') // Legacy cleanup
          sessionStorage.removeItem('analysisJobDescription')
          
          // Remove the prefilled parameter from URL
          const newUrl = window.location.pathname
          window.history.replaceState({}, '', newUrl)
          
          console.log('Successfully loaded prefilled data from analysis')
        }
      } catch (error) {
        console.error('Failed to load prefilled data:', error)
      }
    }
  }, [])

  // Save profile data whenever resumeData changes (excluding jobDescription)
  useEffect(() => {
    if (profileDataLoaded) {
      const profileToSave: UserProfile = {
        personalInfo: {
          name: resumeData.personalInfo.name,
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone,
          location: resumeData.personalInfo.location,
          linkedin: resumeData.personalInfo.linkedin,
          portfolio: resumeData.personalInfo.portfolio,
          github: resumeData.personalInfo.github,
          jobTitle: resumeData.personalInfo.jobTitle
          // Explicitly exclude jobDescription
        },
        summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        lastUpdated: new Date().toISOString()
      }
      saveToLocalStorage(RESUME_DATA_KEY, profileToSave)
    }
  }, [resumeData, profileDataLoaded])

  // Function to clear profile data
  const clearProfileData = () => {
    localStorage.removeItem(RESUME_DATA_KEY)
    setResumeData({
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        github: '',
        jobTitle: '',
        jobDescription: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: {
        technical: [],
        soft: [],
        languages: [],
        certifications: []
      },
      projects: []
    })
    setJobDescription('')
    setProfileDataLoaded(false)
  }

  // Function to update personal info
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  // Function to update summary
  const updateSummary = (value: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }))
  }

  // Function to add experience
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: [],
          achievements: []
        }
      ]
    }))
  }

  // Function to update experience
  const updateExperience = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  // Function to remove experience
  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  // Function to add education
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          school: '',
          location: '',
          graduationDate: '',
          gpa: '',
          honors: []
        }
      ]
    }))
  }

  // Function to update education
  const updateEducation = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  // Function to remove education
  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  // Function to update skills
  const updateSkills = (category: keyof ResumeData['skills'], skills: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: skills
      }
    }))
  }

  // Function to add project
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          name: '',
          description: '',
          technologies: [],
          link: ''
        }
      ]
    }))
  }

  // Function to update project
  const updateProject = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }))
  }

  // Function to remove project
  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }))
  }

  // Rest of the component implementation would go here...
  // This includes the JSX return statement with all the form fields
  
  // Template selection and optimization logic
  const templates = [
    {
      id: 'your-resume-style',
      name: 'Classic Professional',
      description: 'Clean, professional academic-style resume with precise formatting',
      category: 'classic' as const,
      atsOptimized: true
    },
    {
      id: 'modern-tech',
      name: 'Modern Tech',
      description: 'Tech-focused design with code-style formatting',
      category: 'tech' as const,
      atsOptimized: true
    },
    {
      id: 'executive-leadership',
      name: 'Executive Leadership',
      description: 'Professional executive-level presentation',
      category: 'executive' as const,
      atsOptimized: true
    }
  ]

  // Template preview functionality
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [templatePreview, setTemplatePreview] = useState<string>('')

  // Auto-generate preview when template is selected
  useEffect(() => {
    if (selectedTemplate && selectedTemplate !== previewTemplate) {
      generateTemplatePreview(selectedTemplate)
    }
  }, [selectedTemplate])

  const generateTemplatePreview = async (templateId: string) => {
    try {
      const response = await fetch('/api/generate-optimized-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: sampleResumeData,
          jobDescription: 'Sample job description for preview',
          templateId: templateId,
          format: 'html',
          isPreview: true // Add this flag to prevent database saves for previews
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setTemplatePreview(result.data.resume)
          setPreviewTemplate(templateId)
        }
      }
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  // Function to generate resume with template (for analysis users)
  const handleGenerateWithTemplate = async () => {
    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      showAlert({
        title: "Missing Information",
        description: "Please fill in at least your name and email.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    if (!selectedTemplate) {
      showAlert({
        title: "No Template Selected",
        description: "Please select a template for your resume.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    setIsOptimizing(true)
    
    try {
      // Get stored document and roast IDs from session storage
      const storedDocumentId = sessionStorage.getItem('documentId')
      const storedRoastId = sessionStorage.getItem('roastId')
      
      console.log('Generating resume with template (no optimization):', selectedTemplate)
      
      // Use the existing generate-optimized-resume endpoint with skipOptimization: true
      const templateResponse = await fetch('/api/generate-optimized-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData,
          templateId: selectedTemplate,
          format: 'html',
          documentId: storedDocumentId || null,
          roastId: storedRoastId || null,
          skipOptimization: true, // This tells the API to skip LLM optimization
          isPreview: false
        }),
      })

      if (!templateResponse.ok) {
        throw new Error('Failed to generate resume with template')
      }

      const templateResult = await templateResponse.json()
      if (!templateResult.success) {
        throw new Error(templateResult.error || 'Failed to generate resume with template')
      }

      // Transform the result to match the expected format
      const transformedResult: OptimizedResumeResponse = {
        resume: templateResult.data.resume,
        format: 'html' as const,
        template: templateResult.data.template,
        optimizations: {
          suggestions: templateResult.data.optimizations?.suggestions || ['Resume generated with selected template'],
          keywordsFound: templateResult.data.optimizations?.keywordsFound || [],
          atsScore: templateResult.data.optimizations?.atsScore || 85 // Default good score for template generation
        }
      }

      // Store the result and redirect to download page
      sessionStorage.setItem('optimizedResumeResult', JSON.stringify(transformedResult))
      sessionStorage.setItem('resumeDataForDownload', JSON.stringify(resumeData))
      console.log('Resume template generation completed successfully, redirecting to download page')
      
      router.push('/download')

    } catch (error) {
      console.error('Error generating resume with template:', error)
      showAlert({
        title: "Template Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate resume with template. Please try again.",
        type: "error",
        confirmText: "OK"
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleOptimizeResume = async () => {
    if (!jobDescription.trim()) {
      showAlert({
        title: "Missing Job Description",
        description: "Please enter a job description to optimize your resume.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      showAlert({
        title: "Missing Information",
        description: "Please fill in at least your name and email.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    setIsOptimizing(true)
    
    try {
      // Get stored document and roast IDs from session storage
      const storedDocumentId = sessionStorage.getItem('documentId')
      const storedRoastId = sessionStorage.getItem('roastId')
      const storedExtractedResumeId = sessionStorage.getItem('extractedResumeId')
      
      let extractedResumeId = storedExtractedResumeId

      // STEP 1: Extract resume data if we don't have an extractedResumeId
      if (!extractedResumeId) {
        console.log('No extracted resume ID found, extracting resume data first...')
        
        // Convert resume data to text format for extraction
        const resumeText = `
Name: ${resumeData.personalInfo.name}
Email: ${resumeData.personalInfo.email}
Phone: ${resumeData.personalInfo.phone}
Location: ${resumeData.personalInfo.location}
LinkedIn: ${resumeData.personalInfo.linkedin}
Portfolio: ${resumeData.personalInfo.portfolio}
GitHub: ${resumeData.personalInfo.github}
Job Title: ${resumeData.personalInfo.jobTitle}

PROFESSIONAL SUMMARY:
${resumeData.summary}

EXPERIENCE:
${resumeData.experience.map(exp => `
${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})
Location: ${exp.location}
Description: ${exp.description.join('. ')}
Achievements: ${exp.achievements.join('. ')}
`).join('\n')}

EDUCATION:
${resumeData.education.map(edu => `
${edu.degree} from ${edu.school} (${edu.graduationDate})
Location: ${edu.location}
GPA: ${edu.gpa}
Honors: ${edu.honors?.join(', ') || 'None'}
`).join('\n')}

SKILLS:
Technical: ${resumeData.skills.technical.join(', ')}
Soft Skills: ${resumeData.skills.soft.join(', ')}
Languages: ${resumeData.skills.languages?.join(', ') || 'None'}
Certifications: ${resumeData.skills.certifications?.join(', ') || 'None'}

PROJECTS:
${resumeData.projects?.map(proj => `
${proj.name}: ${proj.description}
Technologies: ${proj.technologies.join(', ')}
Link: ${proj.link}
`).join('\n') || ''}
        `.trim()

        const extractResponse = await fetch('/api/extract-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resumeText,
            documentId: storedDocumentId || null,
            roastId: storedRoastId || null,
            bypassCache: false
          }),
        })

        if (!extractResponse.ok) {
          throw new Error('Failed to extract resume data')
        }

        const extractResult = await extractResponse.json()
        if (!extractResult.success) {
          throw new Error(extractResult.error || 'Failed to extract resume data')
        }

        extractedResumeId = extractResult.extractedResumeId
        console.log('Resume extraction successful:', extractResult.cached ? 'from cache' : 'newly extracted')
        
        // Store the extracted resume ID for future use
        if (extractedResumeId) {
          sessionStorage.setItem('extractedResumeId', extractedResumeId)
        }
      } else {
        console.log('Using existing extracted resume ID:', extractedResumeId)
      }

      // STEP 2: Optimize the resume using the extracted data
      console.log('Optimizing resume with extracted data...')
      
      // NOTE: This function is deprecated - use handleGenerateWithTemplate instead
      throw new Error('This optimization method is deprecated. Please use the template-based generation instead.')

    } catch (error) {
      console.error('Error optimizing resume:', error)
      showAlert({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume. Please try again.",
        type: "error",
        confirmText: "OK"
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  // New function to generate resume without LLM optimization
  const handleGetResume = async () => {
    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      showAlert({
        title: "Missing Information",
        description: "Please fill in at least your name and email.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    if (!selectedTemplate) {
      showAlert({
        title: "No Template Selected",
        description: "Please select a template for your resume.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    setIsOptimizing(true)
    
    try {
      console.log('Generating resume without LLM optimization...')
      
      // Use the generate-optimized-resume API but without job description to skip LLM optimization
      const response = await fetch('/api/generate-optimized-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          jobDescription: '', // Empty job description to skip optimization
          templateId: selectedTemplate,
          format: 'html',
          skipOptimization: true // Add flag to skip LLM optimization
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate resume')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate resume')
      }

      // Transform the result to match the expected OptimizedResumeResponse format
      const transformedResult: OptimizedResumeResponse = {
        resume: result.data.resume,
        format: 'html' as const,
        template: {
          id: selectedTemplate,
          name: 'Resume Template',
          description: 'Generated resume template',
          category: 'modern' as const,
          atsOptimized: false
        },
        optimizations: {
          suggestions: [],
          keywordsFound: [],
          atsScore: 0
        }
      }

      // Store the result in sessionStorage and redirect to download page
      sessionStorage.setItem('optimizedResumeResult', JSON.stringify(transformedResult))
      sessionStorage.setItem('resumeDataForDownload', JSON.stringify(resumeData))
      console.log('Resume generation completed successfully, redirecting to download page')
      
      router.push('/download')

    } catch (error) {
      console.error('Error generating resume:', error)
      showAlert({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate resume. Please try again.",
        type: "error",
        confirmText: "OK"
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  // Determine if we should show "Get Resume" or "Generate Optimized Resume"
  const shouldShowGetResume = () => {
    // Always show "Get Resume" - we don't want to do optimization here
    return true
  }

  const handleDownloadPDF = async () => {
    if (!optimizedResult) return
    
    try {
      const blob = await generatePDF(resumeData, optimizedResult.resume)
      downloadBlob(blob, `${resumeData.personalInfo.name}_Resume.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      showAlert({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        type: "error",
        confirmText: "OK"
      })
    }
  }

  const handleDownloadDOCX = async () => {
    if (!optimizedResult) return
    
    try {
      const blob = await generateDOCX(resumeData)
      downloadBlob(blob, `${resumeData.personalInfo.name}_Resume.docx`)
    } catch (error) {
      console.error('Error generating DOCX:', error)
      showAlert({
        title: "DOCX Generation Failed", 
        description: "Failed to generate DOCX. Please try again.",
        type: "error",
        confirmText: "OK"
      })
    }
  }

  if (isOptimizing) {
    return <ResumeOptimizationLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Data Status */}
        {profileDataLoaded && (
          <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <span className="text-green-800 font-semibold">Profile Data Loaded</span>
                  <p className="text-green-600 text-sm">
                    Your personal information and resume details have been restored
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearProfileData}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            </div>
          </div>
        )}

        {/* {optimizedResult ? ( */}
        {false ? (
          // Show optimized result with beautiful design
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Resume Optimized Successfully!
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your resume has been optimized for the target job with an ATS Score of {optimizedResult!.optimizations.atsScore}%
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                  <Button 
                    onClick={handleDownloadPDF} 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    onClick={handleDownloadDOCX} 
                    variant="outline" 
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 shadow-lg"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download DOCX
                  </Button>
                  <Button 
                    onClick={() => setOptimizedResult(null)} 
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 shadow-lg"
                    size="lg"
                  >
                    <Edit3 className="h-5 w-5 mr-2" />
                    Edit Resume
                  </Button>
                </div>
                
                {/* Optimization suggestions */}
                {optimizedResult!.optimizations.suggestions.length > 0 && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <h3 className="font-semibold mb-4 text-amber-800 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Optimization Suggestions
                    </h3>
                    <ul className="space-y-3">
                      {optimizedResult!.optimizations.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-yellow-800">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resume preview */}
                <div className="border rounded-xl p-8 bg-white shadow-inner">
                  <div className="bg-white rounded-lg shadow-inner border overflow-hidden" style={{ minHeight: '600px' }}>
                    <iframe
                      srcDoc={optimizedResult!.resume}
                      className="w-full border-0"
                      style={{ 
                        height: '800px',
                        width: '100%'
                      }}
                      sandbox="allow-same-origin"
                      title="Optimized Resume"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Show form with modern design
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-8">
              <Tabs defaultValue="basic" className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="basic" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <User className="h-4 w-4 mr-2" />
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Experience
                    </TabsTrigger>
                    <TabsTrigger value="education" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Education
                    </TabsTrigger>
                    <TabsTrigger value="optimize" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Template
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="basic" className="space-y-6">
                  {/* Job Description Section */}
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span>Target Job Description</span>
                      </CardTitle>
                      <CardDescription>
                        Paste the job description you're applying for. This will not be saved to your profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Textarea
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[150px] border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </CardContent>
                  </Card>

                  {/* Personal Information Section */}
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-purple-600" />
                        <span>Personal Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                          <Input
                            id="name"
                            value={resumeData.personalInfo.name}
                            onChange={(e) => updatePersonalInfo('name', e.target.value)}
                            placeholder="John Doe"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            placeholder="john.doe@email.com"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone *</Label>
                          <Input
                            id="phone"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location *</Label>
                          <Input
                            id="location"
                            value={resumeData.personalInfo.location}
                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                            placeholder="San Francisco, CA"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title *</Label>
                          <Input
                            id="jobTitle"
                            value={resumeData.personalInfo.jobTitle}
                            onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                            placeholder="Software Engineer"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/johndoe"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="github" className="text-sm font-medium text-gray-700">GitHub</Label>
                          <Input
                            id="github"
                            value={resumeData.personalInfo.github}
                            onChange={(e) => updatePersonalInfo('github', e.target.value)}
                            placeholder="https://github.com/johndoe"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700">Portfolio</Label>
                          <Input
                            id="portfolio"
                            value={resumeData.personalInfo.portfolio}
                            onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                            placeholder="https://johndoe.dev"
                            className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Summary Section */}
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                      <CardTitle>Professional Summary</CardTitle>
                      <CardDescription>
                        A brief overview of your professional background and key achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Textarea
                        placeholder="Experienced software engineer with 5+ years developing scalable web applications..."
                        value={resumeData.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        className="min-h-[100px] border-gray-200 focus:border-green-400 focus:ring-green-400"
                      />
                    </CardContent>
                  </Card>

                  {/* Skills Section */}
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl">
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Technical Skills</Label>
                        <Input
                          placeholder="JavaScript, Python, React, Node.js (comma separated)"
                          value={resumeData.skills.technical.join(', ')}
                          onChange={(e) => updateSkills('technical', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          className="mt-1 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Soft Skills</Label>
                        <Input
                          placeholder="Leadership, Communication, Problem-solving (comma separated)"
                          value={resumeData.skills.soft.join(', ')}
                          onChange={(e) => updateSkills('soft', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          className="mt-1 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Languages</Label>
                        <Input
                          placeholder="English, Spanish, French (comma separated)"
                          value={(resumeData.skills.languages || []).join(', ')}
                          onChange={(e) => updateSkills('languages', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          className="mt-1 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Certifications</Label>
                        <Input
                          placeholder="AWS Certified, Google Cloud Professional (comma separated)"
                          value={(resumeData.skills.certifications || []).join(', ')}
                          onChange={(e) => updateSkills('certifications', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          className="mt-1 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <span>Work Experience</span>
                        </CardTitle>
                        <Button 
                          onClick={addExperience} 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                          size="sm"
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                              </div>
                              Experience {index + 1}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeExperience(index)}
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                            >
                              <span className="mr-2">✕</span>
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Job Title</Label>
                              <Input
                                value={exp.title}
                                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                placeholder="Software Engineer"
                                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                placeholder="TechCorp Inc."
                                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Location</Label>
                              <Input
                                value={exp.location}
                                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                placeholder="San Francisco, CA"
                                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                                <Input
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                  placeholder="2022"
                                  className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">End Date</Label>
                                <Input
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                  placeholder="Present"
                                  className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Job Description (one per line)</Label>
                            <Textarea
                              value={exp.description.join('\n')}
                              onChange={(e) => updateExperience(index, 'description', e.target.value.split('\n').filter(line => line.trim()))}
                              placeholder="• Led development of microservices architecture&#10;• Mentored junior developers"
                              className="mt-1 min-h-[100px] border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Key Achievements (one per line)</Label>
                            <Textarea
                              value={exp.achievements.join('\n')}
                              onChange={(e) => updateExperience(index, 'achievements', e.target.value.split('\n').filter(line => line.trim()))}
                              placeholder="• Reduced system latency by 40%&#10;• Increased team productivity by 25%"
                              className="mt-1 min-h-[80px] border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                          </div>
                        </div>
                      ))}
                      {resumeData.experience.length === 0 && (
                        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No work experience added yet</h3>
                          <p className="text-gray-600 mb-4">Add your professional experience to showcase your career journey</p>
                          <Button 
                            onClick={addExperience}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                          >
                            <Briefcase className="h-4 w-4 mr-2" />
                            Add Your First Experience
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="space-y-6">
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          <span>Education</span>
                        </CardTitle>
                        <Button 
                          onClick={addEducation} 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-bold text-green-600">{index + 1}</span>
                              </div>
                              Education {index + 1}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                            >
                              <span className="mr-2">✕</span>
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                placeholder="Bachelor of Science in Computer Science"
                                className="mt-1 border-gray-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">School</Label>
                              <Input
                                value={edu.school}
                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                placeholder="University of California"
                                className="mt-1 border-gray-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Location</Label>
                              <Input
                                value={edu.location}
                                onChange={(e) => updateEducation(index, 'location', e.target.value)}
                                placeholder="Berkeley, CA"
                                className="mt-1 border-gray-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Graduation Date</Label>
                              <Input
                                value={edu.graduationDate}
                                onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                                placeholder="2019"
                                className="mt-1 border-gray-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">GPA (optional)</Label>
                              <Input
                                value={edu.gpa || ''}
                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                placeholder="3.8"
                                className="mt-1 border-gray-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Honors/Coursework (comma separated)</Label>
                              <Input
                                value={(edu.honors || []).join(', ')}
                                onChange={(e) => updateEducation(index, 'honors', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                placeholder="Magna Cum Laude, Dean's List"
                                className="mt-1 border-gray-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {resumeData.education.length === 0 && (
                        <div className="text-center py-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No education added yet</h3>
                          <p className="text-gray-600 mb-4">Add your educational background to highlight your qualifications</p>
                          <Button 
                            onClick={addEducation}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Add Your First Education
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Projects Section */}
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Code className="h-5 w-5 text-purple-600" />
                          <span>Projects</span>
                        </CardTitle>
                        <Button 
                          onClick={addProject} 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                          size="sm"
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Add Project
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {(resumeData.projects || []).map((project, index) => (
                        <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                              </div>
                              Project {index + 1}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeProject(index)}
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                            >
                              <span className="mr-2">✕</span>
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Project Name</Label>
                              <Input
                                value={project.name}
                                onChange={(e) => updateProject(index, 'name', e.target.value)}
                                placeholder="E-commerce Platform"
                                className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Description</Label>
                              <Textarea
                                value={project.description}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                placeholder="Built a full-stack e-commerce platform with React and Node.js"
                                className="mt-1 min-h-[80px] border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Technologies (comma separated)</Label>
                              <Input
                                value={project.technologies.join(', ')}
                                onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                placeholder="React, Node.js, MongoDB, Stripe"
                                className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Link (optional)</Label>
                              <Input
                                value={project.link || ''}
                                onChange={(e) => updateProject(index, 'link', e.target.value)}
                                placeholder="https://github.com/username/project"
                                className="mt-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!resumeData.projects || resumeData.projects.length === 0) && (
                        <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Code className="h-8 w-8 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects added yet</h3>
                          <p className="text-gray-600 mb-4">Showcase your technical projects and achievements</p>
                          <Button 
                            onClick={addProject}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                          >
                            <Code className="h-4 w-4 mr-2" />
                            Add Your First Project
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="optimize" className="space-y-8">
                  {/* Template Selection */}
                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-t-xl">
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="h-5 w-5 text-orange-600" />
                        <span>Choose Your Template</span>
                      </CardTitle>
                      <CardDescription>
                        Select a professional template optimized for ATS and tailored to your industry
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className={`group relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                              selectedTemplate === template.id
                                ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                                : 'border-gray-200 hover:border-orange-300 bg-white hover:bg-gradient-to-br hover:from-orange-25 hover:to-red-25'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            {/* Template Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                {categoryIcons[template.category]}
                                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                              </div>
                              {template.atsOptimized && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  ATS
                                </Badge>
                              )}
                            </div>

                            {/* Template Description */}
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                              {template.description}
                            </p>

                            {/* Template Category Badge and Preview Button */}
                            <div className="flex items-center justify-between">
                              <Badge className={`${categoryColors[template.category]} capitalize`}>
                                {template.category}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  generateTemplatePreview(template.id)
                                }}
                                className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                            </div>

                            {/* Selection Indicator */}
                            {selectedTemplate === template.id && (
                              <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Hover Effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/5 to-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                        ))}
                      </div>

                      {/* Template Preview Section */}
                      {previewTemplate && templatePreview && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              <Eye className="h-4 w-4 mr-2 text-blue-600" />
                              Template Preview: {templates.find(t => t.id === previewTemplate)?.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPreviewTemplate(null)
                                setTemplatePreview('')
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                          <div className="bg-white rounded-lg shadow-inner border overflow-hidden" style={{ height: '480px' }}>
                            <iframe
                              srcDoc={templatePreview}
                              className="w-full border-0"
                              style={{ 
                                height: '600px',
                                transform: 'scale(0.8)',
                                transformOrigin: 'top left',
                                width: '125%'
                              }}
                              sandbox="allow-same-origin"
                              title="Resume Preview"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Optimization Button */}
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          Generate Your Resume
                        </span>
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Create a professional resume with your selected template
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="text-center space-y-6">
                        {/* Progress Indicators */}
                        <div className="flex items-center justify-center space-x-4 mb-6">
                          <div className={`flex items-center space-x-2 ${resumeData.personalInfo.name && resumeData.personalInfo.email ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${resumeData.personalInfo.name && resumeData.personalInfo.email ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {resumeData.personalInfo.name && resumeData.personalInfo.email ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">2</span>}
                            </div>
                            <span className="text-sm font-medium">Personal Info</span>
                          </div>
                          <div className="w-8 h-0.5 bg-gray-200"></div>
                          <div className={`flex items-center space-x-2 ${selectedTemplate ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedTemplate ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {selectedTemplate ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">3</span>}
                            </div>
                            <span className="text-sm font-medium">Template</span>
                          </div>
                        </div>

                        {/* Mode indicator */}
                        {false && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 flex items-center justify-center">
                              <FileText className="h-4 w-4 mr-2" />
                              <strong>Basic Resume Mode:</strong>&nbsp;Add a job description to enable AI optimization
                            </p>
                          </div>
                        )}

                        {false && (
                          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-800 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 mr-2" />
                              <strong>AI Optimization Mode:</strong>&nbsp;Resume will be optimized for your target job
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={handleGenerateWithTemplate}
                          disabled={isOptimizing || !resumeData.personalInfo.name || !resumeData.personalInfo.email || !selectedTemplate}
                          className="w-full max-w-md bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                          size="lg"
                        >
                          <Zap className="h-5 w-5 mr-2" />
                          {isOptimizing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating Resume...
                            </>
                          ) : (
                            'Generate Resume'
                          )}
                        </Button>

                        {(!resumeData.personalInfo.name || !resumeData.personalInfo.email || !selectedTemplate) && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Please complete the following steps:
                            </p>
                            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                              {!resumeData.personalInfo.name && <li>• Enter your full name</li>}
                              {!resumeData.personalInfo.email && <li>• Enter your email address</li>}
                              {!selectedTemplate && <li>• Select a template</li>}
                            </ul>
                          </div>
                        )}

                        {/* Features List */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">ATS Optimized</h4>
                            <p className="text-sm text-gray-600">Optimized to pass Applicant Tracking Systems</p>
                          </div>
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Sparkles className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
                            <p className="text-sm text-gray-600">Smart keyword matching and content optimization</p>
                          </div>
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Higher Success</h4>
                            <p className="text-sm text-gray-600">Increase your chances of landing interviews</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                {/* Quick Tips Card */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-800">
                      <Sparkles className="h-5 w-5" />
                      <span>Pro Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">1</span>
                      </div>
                      <p className="text-sm text-blue-700">Use action verbs to start bullet points</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">2</span>
                      </div>
                      <p className="text-sm text-blue-700">Quantify achievements with numbers</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">3</span>
                      </div>
                      <p className="text-sm text-blue-700">Match keywords from job description</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">4</span>
                      </div>
                      <p className="text-sm text-blue-700">Keep it concise and relevant</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Card */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-800">
                      <TrendingUp className="h-5 w-5" />
                      <span>Your Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">Job Description</span>
                        {jobDescription.trim() ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">Personal Info</span>
                        {resumeData.personalInfo.name && resumeData.personalInfo.email ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">Experience</span>
                        {resumeData.experience.length > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">Template Selected</span>
                        {selectedTemplate ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-green-700 mb-2">
                        <span>Completion</span>
                        <span>
                          {Math.round(
                            ((jobDescription.trim() ? 1 : 0) +
                            (resumeData.personalInfo.name && resumeData.personalInfo.email ? 1 : 0) +
                            (resumeData.experience.length > 0 ? 1 : 0) +
                            (selectedTemplate ? 1 : 0)) / 4 * 100
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.round(
                              ((jobDescription.trim() ? 1 : 0) +
                              (resumeData.personalInfo.name && resumeData.personalInfo.email ? 1 : 0) +
                              (resumeData.experience.length > 0 ? 1 : 0) +
                              (selectedTemplate ? 1 : 0)) / 4 * 100
                            )}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ATS Score Info */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-800">
                      <Target className="h-5 w-5" />
                      <span>ATS Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-purple-700">
                      Our AI analyzes your resume against the job description to ensure maximum ATS compatibility.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-purple-700">Keyword optimization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-purple-700">Format compatibility</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-purple-700">Content structure</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resume Optimization Tips Card */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-amber-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-amber-800">
                      <Sparkles className="h-5 w-5" />
                      <span>Optimization Tips</span>
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      Make your resume stand out with these proven strategies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Target className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800">Use Keywords</p>
                          <p className="text-xs text-amber-700">Match 60-80% of job description keywords</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800">Quantify Results</p>
                          <p className="text-xs text-amber-700">Include numbers, percentages, and metrics</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800">Action Verbs</p>
                          <p className="text-xs text-amber-700">Start bullets with strong action words</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800">ATS Friendly</p>
                          <p className="text-xs text-amber-700">Use standard fonts and clear formatting</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border border-amber-200">
                      <div className="text-center">
                        <p className="text-xs text-amber-700 mb-1">Optimized resumes get</p>
                        <p className="text-lg font-bold text-amber-800">3x more</p>
                        <p className="text-xs text-amber-700">interview callbacks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {AlertDialog}
    </div>
  )
} 