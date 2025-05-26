"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { Textarea } from "./textarea"
import { Input } from "./input"
import { Label } from "./label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { useAlertDialog } from "./alert-dialog"
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

interface Template {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'tech' | 'creative' | 'executive'
  atsOptimized: boolean
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

// localStorage utilities for resume data
const RESUME_DATA_KEY = 'resume-optimizer-data'
const JOB_DESCRIPTION_KEY = 'resume-optimizer-job-description'

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

// User profile data interface
interface UserProfile {
  personalInfo: ResumeData['personalInfo']
  summary?: string
  experience?: ResumeData['experience']
  education?: ResumeData['education']
  skills?: ResumeData['skills']
  projects?: ResumeData['projects']
  lastUpdated: string
}

export function ResumeOptimizer() {
  const { data: session, status } = useSession()
  const { showAlert, AlertDialog } = useAlertDialog()
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false)
  const [isPrefilledFromAnalysis, setIsPrefilledFromAnalysis] = useState(false)
  
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-ats')
  const [jobDescription, setJobDescription] = useState('')
  // Add state for raw skills input
  const [technicalSkillsInput, setTechnicalSkillsInput] = useState('')
  const [softSkillsInput, setSoftSkillsInput] = useState('')
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
    experience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: [],
      achievements: []
    }],
    education: [{
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: '',
      honors: []
    }],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: []
    },
    projects: [{
      name: '',
      description: '',
      technologies: [],
      link: ''
    }]
  })
  const [generatedResume, setGeneratedResume] = useState<OptimizedResumeResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('templates')
  const [isEditMode, setIsEditMode] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')
  const [isUpdatingPreview, setIsUpdatingPreview] = useState(false)

  // Fetch available templates
  useEffect(() => {
    fetchTemplates()
  }, [])

  // Load user profile data on component mount
  useEffect(() => {
    if (status === 'loading') return // Wait for session to load
    
    loadUserProfile()
  }, [status, session])

  // Check for pre-filled data from analysis page
  useEffect(() => {
    const checkForPrefilledData = async () => {
      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search)
      const prefilledData = urlParams.get('prefilled')
      
      if (prefilledData === 'true') {
        // Load from session storage
        const extractedData = sessionStorage.getItem('extractedResumeData')
        const analysisJobDescription = sessionStorage.getItem('analysisJobDescription')
        
        if (extractedData) {
          try {
            const resumeData = JSON.parse(extractedData)
            console.log('Loading pre-filled resume data from analysis...')
            
            // Set the resume data
            setResumeData(resumeData)
            
            // Set skills input fields
            if (resumeData.skills?.technical) {
              setTechnicalSkillsInput(resumeData.skills.technical.join(', '))
            }
            if (resumeData.skills?.soft) {
              setSoftSkillsInput(resumeData.skills.soft.join(', '))
            }
            
            // Set job description if available
            if (analysisJobDescription) {
              setJobDescription(analysisJobDescription)
            }
            
            // Mark as pre-filled from analysis
            setIsPrefilledFromAnalysis(true)
            
            // Skip to the data entry tab since everything is pre-filled
            setActiveTab('data')
            
            // Clean up session storage
            sessionStorage.removeItem('extractedResumeData')
            sessionStorage.removeItem('analysisJobDescription')
            
            // Remove URL parameter
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
            
          } catch (error) {
            console.error('Failed to parse pre-filled resume data:', error)
          }
        }
      }
    }
    
    // Only check for prefilled data after the component has loaded
    if (hasLoadedProfile) {
      checkForPrefilledData()
    }
  }, [hasLoadedProfile])

  // Auto-save resume data to localStorage when it changes
  useEffect(() => {
    if (hasLoadedProfile) {
      saveToLocalStorage(RESUME_DATA_KEY, resumeData)
    }
  }, [resumeData, hasLoadedProfile])

  // Auto-save job description to localStorage
  useEffect(() => {
    if (hasLoadedProfile && jobDescription) {
      saveToLocalStorage(JOB_DESCRIPTION_KEY, jobDescription)
    }
  }, [jobDescription, hasLoadedProfile])

  // Initialize markdown content when resume is generated
  useEffect(() => {
    if (generatedResume?.resume && !markdownContent) {
      initializeMarkdownContent()
    }
  }, [generatedResume])

  // Load user profile from various sources
  const loadUserProfile = async () => {
    setIsLoadingProfile(true)
    
    try {
      let profileData: UserProfile | null = null
      
      // 1. Try to load from user's database profile (if authenticated)
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            profileData = data.profile
          }
        } catch (error) {
          console.log('No user profile found in database, will check localStorage')
        }
      }
      
      // 2. Fallback to localStorage
      if (!profileData) {
        profileData = loadFromLocalStorage(RESUME_DATA_KEY)
      }
      
      // 3. Pre-fill with session data if available
      const sessionData = getSessionBasedData()
      
      // Merge data with priority: Database > localStorage > session > defaults
      const mergedData = mergeResumeData(profileData, sessionData)
      
      // Load job description from localStorage
      const savedJobDescription = loadFromLocalStorage(JOB_DESCRIPTION_KEY)
      if (savedJobDescription) {
        setJobDescription(savedJobDescription)
      }
      
      // Update state
      setResumeData(mergedData)
      
      // Update skills input fields
      if (mergedData.skills.technical.length > 0) {
        setTechnicalSkillsInput(mergedData.skills.technical.join(', '))
      }
      if (mergedData.skills.soft.length > 0) {
        setSoftSkillsInput(mergedData.skills.soft.join(', '))
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setIsLoadingProfile(false)
      setHasLoadedProfile(true)
    }
  }

  // Get data from user session
  const getSessionBasedData = (): Partial<ResumeData> => {
    if (!session?.user) return {}
    
    return {
      personalInfo: {
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        github: '',
        jobTitle: '',
        jobDescription: ''
      }
    }
  }

  // Merge resume data with priority
  const mergeResumeData = (profileData: UserProfile | null, sessionData: Partial<ResumeData>): ResumeData => {
    const defaultData: ResumeData = {
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
      experience: [{
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: [],
        achievements: []
      }],
      education: [{
        degree: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: '',
        honors: []
      }],
      skills: {
        technical: [],
        soft: [],
        languages: [],
        certifications: []
      },
      projects: [{
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    }

    // Start with defaults
    let merged = { ...defaultData }

    // Apply session data
    if (sessionData.personalInfo) {
      merged.personalInfo = { ...merged.personalInfo, ...sessionData.personalInfo }
    }

    // Apply profile data (highest priority)
    if (profileData) {
      merged.personalInfo = { ...merged.personalInfo, ...profileData.personalInfo }
      if (profileData.summary) merged.summary = profileData.summary
      if (profileData.experience && profileData.experience.length > 0) merged.experience = profileData.experience
      if (profileData.education && profileData.education.length > 0) merged.education = profileData.education
      if (profileData.skills) merged.skills = { ...merged.skills, ...profileData.skills }
      if (profileData.projects && profileData.projects.length > 0) merged.projects = profileData.projects
    }

    return merged
  }

  // Save profile to database (for authenticated users)
  const saveUserProfile = async () => {
    if (!session?.user?.id) return
    
    try {
      const profileData: UserProfile = {
        personalInfo: resumeData.personalInfo,
        summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        lastUpdated: new Date().toISOString()
      }

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile: profileData }),
      })

      if (response.ok) {
        // Show success message or toast
        console.log('Profile saved successfully')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  // Helper function to parse skills from comma-separated string
  const parseSkills = (input: string): string[] => {
    return input
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
  }

  // Helper function to update skills in resume data
  const updateSkills = (type: 'technical' | 'soft', input: string) => {
    const skills = parseSkills(input)
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: skills
      }
    }))
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/generate-optimized-resume')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.data.templates)
      } else {
        // Fallback to default templates
        setTemplates(getDefaultTemplates())
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      // Fallback to default templates
      setTemplates(getDefaultTemplates())
    }
  }

  const getDefaultTemplates = (): Template[] => [
    {
      id: 'modern-ats',
      name: 'Modern ATS-Optimized',
      description: 'Clean, professional design optimized for ATS systems',
      category: 'modern',
      atsOptimized: true
    },
    {
      id: 'tech-focused',
      name: 'Tech-Focused',
      description: 'Developer-friendly template with emphasis on technical skills',
      category: 'tech',
      atsOptimized: true
    },
    {
      id: 'executive',
      name: 'Executive Leadership',
      description: 'Sophisticated template for senior leadership positions',
      category: 'executive',
      atsOptimized: true
    }
  ]

  const generateOptimizedResume = async () => {
    if (!jobDescription.trim()) {
      showAlert({
        title: "Job Description Required",
        description: "Please enter a job description to optimize your resume for the specific role.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      showAlert({
        title: "Personal Information Required",
        description: "Please fill in at least your name and email address to generate your resume.",
        type: "warning",
        confirmText: "OK"
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-optimized-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          templateId: selectedTemplate,
          format: 'html'
        }),
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedResume(data.data)
        setActiveTab('preview')
      } else {
        showAlert({
          title: "Resume Generation Failed",
          description: data.error || "Failed to generate resume. Please try again.",
          type: "error",
          confirmText: "OK"
        })
      }
    } catch (error) {
      console.error('Error generating resume:', error)
      showAlert({
        title: "Resume Generation Failed",
        description: "Failed to generate resume. Please try again.",
        type: "error",
        confirmText: "OK"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadResume = () => {
    if (!generatedResume) return

    const fileName = resumeData.personalInfo.name 
      ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume_Optimized.html`
      : 'Optimized_Resume.html'

    const blob = new Blob([generatedResume.resume], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAsText = () => {
    if (!generatedResume) return

    // Convert HTML to plain text for ATS systems
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = generatedResume.resume
    const textContent = tempDiv.textContent || tempDiv.innerText || ''
    
    const fileName = resumeData.personalInfo.name 
      ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume_ATS.txt`
      : 'Resume_ATS.txt'

    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: [],
        achievements: []
      }]
    }))
  }

  const updateExperience = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: '',
        honors: []
      }]
    }))
  }

  const updateEducation = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const getSelectedTemplate = () => {
    return templates.find(t => t.id === selectedTemplate)
  }

  // Convert HTML resume to markdown-like format for editing
  const htmlToMarkdown = (html: string): string => {
    if (!html) return ''
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    
    let markdown = ''
    
    // Extract name
    const nameElement = tempDiv.querySelector('.name')
    if (nameElement) {
      markdown += `# ${nameElement.textContent?.trim() || ''}\n\n`
    }
    
    // Extract contact info - be more careful to preserve structure
    const contactElement = tempDiv.querySelector('.contact')
    if (contactElement) {
      let contactText = ''
      
      // Check if contact has child elements (like links)
      if (contactElement.children.length > 0) {
        // Has structured content - try to preserve it
        const contactHTML = contactElement.innerHTML
        
        // Extract text content but try to preserve link references
        const tempContactDiv = document.createElement('div')
        tempContactDiv.innerHTML = contactHTML
        
        // Get all text nodes and link elements
        const walker = document.createTreeWalker(
          tempContactDiv,
          NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
          {
            acceptNode: function(node) {
              if (node.nodeType === Node.TEXT_NODE) {
                return NodeFilter.FILTER_ACCEPT
              }
              if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName.toLowerCase() === 'a') {
                return NodeFilter.FILTER_ACCEPT
              }
              return NodeFilter.FILTER_SKIP
            }
          }
        )
        
        let node
        const contactParts: string[] = []
        while (node = walker.nextNode()) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim()
            if (text && text !== '•' && text !== '|') {
              contactParts.push(text)
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (element.tagName.toLowerCase() === 'a') {
              const linkText = element.textContent?.trim()
              const href = element.getAttribute('href')
              if (linkText && href) {
                if (href.includes('linkedin')) {
                  contactParts.push('LinkedIn')
                } else if (href.includes('github')) {
                  contactParts.push('GitHub')
                } else {
                  contactParts.push(linkText)
                }
              }
            }
          }
        }
        
        contactText = contactParts.filter(part => part.length > 0).join(' • ')
      } else {
        // Simple text content
        contactText = contactElement.textContent?.trim() || ''
      }
      
      if (contactText) {
        markdown += `**Contact:** ${contactText}\n\n`
      }
    }
    
    // Extract sections from both left and right columns
    const allSections = tempDiv.querySelectorAll('.section')
    
    // Also check for left-column contact info section specifically
    const leftColumnContactSection = tempDiv.querySelector('.left-column .section')
    if (leftColumnContactSection) {
      const contactSectionTitle = leftColumnContactSection.querySelector('.section-title')
      if (contactSectionTitle && contactSectionTitle.textContent?.toLowerCase().includes('contact')) {
        // Extract detailed contact info from left column
        const contactItems = leftColumnContactSection.querySelectorAll('.contact-item')
        if (contactItems.length > 0) {
          const contactDetails: string[] = []
          contactItems.forEach(item => {
            const text = item.textContent?.trim()
            if (text) {
              contactDetails.push(text)
            }
          })
          if (contactDetails.length > 0) {
            markdown += `## Contact\n\n${contactDetails.join('\n')}\n\n`
          }
        }
      }
    }
    
    allSections.forEach(section => {
      const titleElement = section.querySelector('.section-title')
      const title = titleElement?.textContent?.trim()
      
      if (title) {
        markdown += `## ${title}\n\n`
        
        if (title.toLowerCase().includes('summary')) {
          const summaryElement = section.querySelector('.summary')
          if (summaryElement) {
            markdown += `${summaryElement.textContent?.trim() || ''}\n\n`
          }
        } else if (title.toLowerCase().includes('contact')) {
          // Handle contact section from left column
          const contactItems = section.querySelectorAll('.contact-item')
          if (contactItems.length > 0) {
            contactItems.forEach(item => {
              const text = item.textContent?.trim()
              if (text) {
                markdown += `${text}\n`
              }
            })
            markdown += '\n'
          } else {
            // Fallback to any text content
            const textContent = section.textContent?.replace(title, '').trim()
            if (textContent) {
              markdown += `${textContent}\n\n`
            }
          }
        } else if (title.toLowerCase().includes('skills')) {
          // Handle skills section - check for different structures
          const skillGroups = section.querySelectorAll('.skill-group')
          if (skillGroups.length > 0) {
            skillGroups.forEach(group => {
              const groupTitle = group.querySelector('h4')?.textContent?.trim()
              if (groupTitle) {
                markdown += `### ${groupTitle}\n`
                const skills = group.querySelectorAll('.skill-tag, .skill-item')
                const skillList = Array.from(skills).map(skill => skill.textContent?.trim()).filter(Boolean)
                if (skillList.length > 0) {
                  markdown += `${skillList.join(', ')}\n\n`
                }
              }
            })
          } else {
            // Check for tech-skills structure
            const techSkills = section.querySelector('.tech-skills')
            if (techSkills) {
              const skillGroups = techSkills.querySelectorAll('.skill-group')
              skillGroups.forEach(group => {
                const groupTitle = group.querySelector('h4')?.textContent?.trim()
                if (groupTitle) {
                  markdown += `### ${groupTitle}\n`
                  const skills = group.querySelectorAll('.skill-tag, .skill-item')
                  const skillList = Array.from(skills).map(skill => skill.textContent?.trim()).filter(Boolean)
                  if (skillList.length > 0) {
                    markdown += `${skillList.join(', ')}\n\n`
                  }
                }
              })
            } else {
              // Check for executive skills structure
              const skillsExecutive = section.querySelector('.skills-executive')
              if (skillsExecutive) {
                const skillCategories = skillsExecutive.querySelectorAll('.skill-category')
                skillCategories.forEach(category => {
                  const categoryTitle = category.querySelector('h4')?.textContent?.trim()
                  if (categoryTitle) {
                    markdown += `### ${categoryTitle}\n`
                    const skillList = category.querySelector('.skill-list')?.textContent?.trim()
                    if (skillList) {
                      markdown += `${skillList}\n\n`
                    }
                  }
                })
              } else {
                // Check for skills-list structure (common in templates)
                const skillsList = section.querySelector('.skills-list')
                if (skillsList) {
                  const skills = skillsList.querySelectorAll('.skill-tag, .skill-item, span')
                  const skillList = Array.from(skills).map(skill => skill.textContent?.trim()).filter(Boolean)
                  if (skillList.length > 0) {
                    markdown += `${skillList.join(', ')}\n\n`
                  }
                } else {
                  // Fallback: look for any skill tags or items directly in section
                  const skills = section.querySelectorAll('.skill-tag, .skill-item, .skill')
                  if (skills.length > 0) {
                    const skillList = Array.from(skills).map(skill => skill.textContent?.trim()).filter(Boolean)
                    if (skillList.length > 0) {
                      markdown += `${skillList.join(', ')}\n\n`
                    }
                  } else {
                    // Last resort: get all text content and try to parse it
                    const skillsText = section.textContent?.replace(title, '').trim()
                    if (skillsText) {
                      // Try to detect if it's a comma-separated list
                      if (skillsText.includes(',') || skillsText.includes('•')) {
                        const cleanedText = skillsText.replace(/[•\n\r]/g, ',').replace(/\s+/g, ' ')
                        const skillList = cleanedText.split(',').map(s => s.trim()).filter(s => s && s.length > 1)
                        if (skillList.length > 0) {
                          markdown += `${skillList.join(', ')}\n\n`
                        }
                      } else {
                        markdown += `${skillsText}\n\n`
                      }
                    }
                  }
                }
              }
            }
          }
        } else if (title.toLowerCase().includes('experience')) {
          const jobs = section.querySelectorAll('.job')
          jobs.forEach(job => {
            const jobTitle = job.querySelector('.job-title')?.textContent?.trim()
            const company = job.querySelector('.company')?.textContent?.trim()
            const dateLocation = job.querySelector('.date-location, .job-meta')?.textContent?.trim()
            
            if (jobTitle) {
              markdown += `### ${jobTitle}\n`
              if (company) markdown += `**${company}**\n`
              if (dateLocation) markdown += `*${dateLocation}*\n\n`
              
              const achievements = job.querySelectorAll('li')
              achievements.forEach(achievement => {
                const text = achievement.textContent?.trim()
                if (text) {
                  markdown += `- ${text}\n`
                }
              })
              markdown += '\n'
            }
          })
        } else if (title.toLowerCase().includes('education')) {
          const educationItems = section.querySelectorAll('.education-item')
          educationItems.forEach(item => {
            const degree = item.querySelector('.degree')?.textContent?.trim()
            const school = item.querySelector('.school')?.textContent?.trim()
            const details = item.querySelector('.edu-details')?.textContent?.trim()
            
            if (degree) {
              markdown += `### ${degree}\n`
              if (school) markdown += `**${school}**\n`
              if (details) markdown += `*${details}*\n\n`
            }
          })
        } else if (title.toLowerCase().includes('project')) {
          const projects = section.querySelectorAll('.project, [style*="margin-bottom"]')
          projects.forEach(project => {
            const projectName = project.querySelector('.project-name, [style*="font-weight: 600"]')?.textContent?.trim()
            const projectDesc = project.querySelector('.project-desc, [style*="color: #555555"]')?.textContent?.trim()
            const projectTech = project.querySelector('.project-tech, [style*="Technologies"]')?.textContent?.trim()
            
            if (projectName) {
              markdown += `### ${projectName}\n`
              if (projectDesc) markdown += `${projectDesc}\n`
              if (projectTech) markdown += `*${projectTech}*\n\n`
            }
          })
        }
      }
    })
    
    return markdown
  }

  // Convert markdown-like format back to HTML
  const markdownToHtml = (markdown: string): string => {
    if (!generatedResume) return ''
    
    const lines = markdown.split('\n')
    let html = generatedResume.resume
    
    // Create a temporary div to work with
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    
    // Parse markdown content into structured data
    const parsedContent: {
      name: string
      contact: string
      sections: Record<string, Array<{
        title: string
        content: string[]
      }>>
    } = {
      name: '',
      contact: '',
      sections: {}
    }
    
    let currentSection = ''
    let currentSubsection = ''
    let currentContent: string[] = []
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('# ')) {
        // Main name
        parsedContent.name = trimmed.substring(2).trim()
      } else if (trimmed.startsWith('**Contact:**')) {
        // Contact information
        parsedContent.contact = trimmed.substring(12).trim()
      } else if (trimmed.startsWith('## ')) {
        // Section headers - save previous section first
        if (currentSection && currentSubsection) {
          if (!parsedContent.sections[currentSection]) {
            parsedContent.sections[currentSection] = []
          }
          parsedContent.sections[currentSection].push({
            title: currentSubsection,
            content: currentContent.slice()
          })
        } else if (currentSection && currentContent.length > 0) {
          // Section without subsection (like summary)
          if (!parsedContent.sections[currentSection]) {
            parsedContent.sections[currentSection] = []
          }
          parsedContent.sections[currentSection].push({
            title: '',
            content: currentContent.slice()
          })
        }
        
        currentSection = trimmed.substring(3).trim()
        currentSubsection = ''
        currentContent = []
      } else if (trimmed.startsWith('### ')) {
        // Subsection headers - save previous subsection first
        if (currentSection && currentSubsection) {
          if (!parsedContent.sections[currentSection]) {
            parsedContent.sections[currentSection] = []
          }
          parsedContent.sections[currentSection].push({
            title: currentSubsection,
            content: currentContent.slice()
          })
        }
        currentSubsection = trimmed.substring(4).trim()
        currentContent = []
      } else if (trimmed) {
        // Content lines
        if (currentSection && !currentSubsection && !trimmed.startsWith('**Contact:')) {
          // This is section content without subsection (like summary)
          currentContent.push(trimmed)
        } else if (currentSubsection) {
          currentContent.push(trimmed)
        }
      }
    })
    
    // Handle the last section/subsection
    if (currentSection && currentSubsection) {
      if (!parsedContent.sections[currentSection]) {
        parsedContent.sections[currentSection] = []
      }
      parsedContent.sections[currentSection].push({
        title: currentSubsection,
        content: currentContent.slice()
      })
    } else if (currentSection && currentContent.length > 0) {
      if (!parsedContent.sections[currentSection]) {
        parsedContent.sections[currentSection] = []
      }
      parsedContent.sections[currentSection].push({
        title: '',
        content: currentContent.slice()
      })
    }
    
    // Update the HTML with parsed content
    
    // Update name
    if (parsedContent.name) {
      const nameElement = tempDiv.querySelector('.name')
      if (nameElement) {
        nameElement.textContent = parsedContent.name
      }
    }
    
    // Update contact - prioritize header contact, be very careful with sidebar contact
    if (parsedContent.contact) {
      // First try to update header contact
      const headerContactElement = tempDiv.querySelector('.header .contact')
      if (headerContactElement) {
        // Update header contact carefully
        const originalHTML = headerContactElement.innerHTML
        const hasLinks = originalHTML.includes('<a')
        
        if (hasLinks) {
          // Try to preserve the link structure while updating the content
          const linkMatches = originalHTML.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g)
          let newContactHTML = parsedContent.contact
          
          // If we have links in the original, try to preserve them
          if (linkMatches) {
            linkMatches.forEach(linkMatch => {
              const hrefMatch = linkMatch.match(/href="([^"]*)"/)
              const textMatch = linkMatch.match(/>([^<]*)</)
              if (hrefMatch && textMatch) {
                const href = hrefMatch[1]
                // If the contact text mentions LinkedIn, GitHub, etc., preserve those links
                if (newContactHTML.toLowerCase().includes('linkedin') && href.includes('linkedin')) {
                  newContactHTML = newContactHTML.replace(/linkedin/i, `<a href="${href}">LinkedIn</a>`)
                }
                if (newContactHTML.toLowerCase().includes('github') && href.includes('github')) {
                  newContactHTML = newContactHTML.replace(/github/i, `<a href="${href}">GitHub</a>`)
                }
              }
            })
          }
          headerContactElement.innerHTML = newContactHTML
        } else {
          headerContactElement.textContent = parsedContent.contact
        }
      } else {
        // Fallback: try sidebar contact, but be very careful
        const sidebarContactElement = tempDiv.querySelector('.left-column .contact, .contact')
        if (sidebarContactElement && !sidebarContactElement.closest('.header')) {
          sidebarContactElement.textContent = parsedContent.contact
        }
      }
    }
    
    // Update sections - be more careful to avoid duplicates
    const processedSectionTypes = new Set<string>()
    
    Object.keys(parsedContent.sections).forEach(sectionName => {
      const sectionData = parsedContent.sections[sectionName]
      const sectionKey = sectionName.toLowerCase()
      
      // Skip if we've already processed this type of section
      if (processedSectionTypes.has(sectionKey)) {
        return
      }
      processedSectionTypes.add(sectionKey)
      
      // Find the corresponding section in HTML
      const sections = tempDiv.querySelectorAll('.section')
      let targetSection: Element | null = null
      
      sections.forEach(section => {
        const titleElement = section.querySelector('.section-title')
        if (titleElement && titleElement.textContent?.toLowerCase().includes(sectionKey)) {
          // Make sure we haven't already processed this section
          if (!targetSection) {
            targetSection = section
          }
        }
      })
      
      if (targetSection) {
        if (sectionKey.includes('summary')) {
          // Handle summary section
          const summaryElement = (targetSection as Element).querySelector('.summary')
          if (summaryElement && sectionData[0]) {
            summaryElement.textContent = sectionData[0].content.join(' ')
          }
        } else if (sectionKey.includes('contact')) {
          // Handle contact section from left column - only if no header contact was updated
          if (!parsedContent.contact) {
            const contactItems = targetSection as Element
            const existingContact = contactItems.querySelectorAll('.contact-item')
            
            // Clear existing contact
            existingContact.forEach(item => item.remove())
            
            // Add new contact
            sectionData.forEach((contact: { title: string; content: string[] }) => {
              if (contact.title) {
                const contactElement = document.createElement('div')
                contactElement.className = 'contact-item'
                
                let contactHtml = `<div class="contact-icon">📧</div>`
                
                contact.content.forEach((line: string) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    // Contact details
                    const details = line.substring(2, line.length - 2)
                    contactHtml += `<div class="contact-text">${details}</div>`
                  } else if (line.startsWith('*') && line.endsWith('*')) {
                    // Contact icons
                    const icon = line.substring(1, line.length - 1)
                    contactHtml += `<div class="contact-icon">${icon}</div>`
                  }
                })
                
                contactElement.innerHTML = contactHtml
                contactItems.appendChild(contactElement)
              }
            })
          }
        } else if (sectionKey.includes('skills')) {
          // Handle skills section
          const skillsContainer = targetSection as Element
          
          // Find the container for skills (could be different structures)
          let skillsContentContainer = skillsContainer.querySelector('.tech-skills, .skills-executive, .skills-list')
          
          if (!skillsContentContainer) {
            // Look for any existing skill containers
            skillsContentContainer = skillsContainer.querySelector('[class*="skill"]')
          }
          
          if (!skillsContentContainer) {
            // Create a container if it doesn't exist
            skillsContentContainer = document.createElement('div')
            skillsContentContainer.className = 'skills-content'
            
            // Remove existing content except title
            const titleElement = skillsContainer.querySelector('.section-title')
            const existingContent = Array.from(skillsContainer.children).filter(child => 
              !child.classList.contains('section-title')
            )
            existingContent.forEach(child => child.remove())
            
            skillsContainer.appendChild(skillsContentContainer)
          }
          
          // Clear existing skill groups/items
          const existingSkillGroups = skillsContentContainer.querySelectorAll('.skill-group, .skill-category, .skill-item, .skill-tag, .skill')
          existingSkillGroups.forEach(group => group.remove())
          
          // Also clear any direct text content
          const textNodes = Array.from(skillsContentContainer.childNodes).filter(node => 
            node.nodeType === Node.TEXT_NODE
          )
          textNodes.forEach(node => node.remove())
          
          // Add new skills
          if (sectionData.length > 0) {
            sectionData.forEach((skillGroup: { title: string; content: string[] }) => {
              if (skillGroup.title) {
                // This is a skill group with a title
                const skillGroupElement = document.createElement('div')
                skillGroupElement.className = 'skill-group'
                
                let skillHtml = `<h4 style="font-weight: 600; font-size: 10px; color: #2c3e50; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">${skillGroup.title}</h4>`
                skillHtml += '<div class="skill-items" style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 15px;">'
                
                skillGroup.content.forEach((line: string) => {
                  if (!line.startsWith('**') && !line.startsWith('*')) {
                    // Skills list
                    const skills = line.split(',').map(s => s.trim()).filter(s => s)
                    skills.forEach(skill => {
                      skillHtml += `<span class="skill-tag" style="background: #edf2f7; color: #2d3748; padding: 2px 6px; border-radius: 3px; font-size: 9px; border: 1px solid #cbd5e0;">${skill}</span>`
                    })
                  }
                })
                
                skillHtml += '</div>'
                skillGroupElement.innerHTML = skillHtml
                skillsContentContainer.appendChild(skillGroupElement)
              } else if (skillGroup.content.length > 0) {
                // This is skills without a group title
                const skillsWrapper = document.createElement('div')
                skillsWrapper.className = 'skills-list'
                skillsWrapper.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 15px;'
                
                skillGroup.content.forEach((line: string) => {
                  if (!line.startsWith('**') && !line.startsWith('*')) {
                    // Skills list
                    const skills = line.split(',').map(s => s.trim()).filter(s => s)
                    skills.forEach(skill => {
                      const skillElement = document.createElement('span')
                      skillElement.className = 'skill-tag'
                      skillElement.style.cssText = 'background: #edf2f7; color: #2d3748; padding: 2px 6px; border-radius: 3px; font-size: 9px; border: 1px solid #cbd5e0;'
                      skillElement.textContent = skill
                      skillsWrapper.appendChild(skillElement)
                    })
                  }
                })
                
                skillsContentContainer.appendChild(skillsWrapper)
              }
            })
          } else {
            // Fallback: create a simple text container
            const fallbackContainer = document.createElement('div')
            fallbackContainer.className = 'skills-fallback'
            fallbackContainer.style.cssText = 'font-size: 10px; color: #555; line-height: 1.6;'
            fallbackContainer.textContent = 'No skills data available'
            skillsContentContainer.appendChild(fallbackContainer)
          }
        } else if (sectionKey.includes('experience')) {
          // Handle experience section
          const jobsContainer = targetSection as Element
          const existingJobs = jobsContainer.querySelectorAll('.job')
          
          // Clear existing jobs
          existingJobs.forEach(job => job.remove())
          
          // Add new jobs
          sectionData.forEach((job: { title: string; content: string[] }) => {
            if (job.title) {
              const jobElement = document.createElement('div')
              jobElement.className = 'job'
              
              let jobHtml = `<div class="job-title">${job.title}</div>`
              
              job.content.forEach((line: string) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  // Company name
                  const company = line.substring(2, line.length - 2)
                  jobHtml += `<div class="company">${company}</div>`
                } else if (line.startsWith('*') && line.endsWith('*')) {
                  // Date and location
                  const dateLocation = line.substring(1, line.length - 1)
                  jobHtml += `<div class="date-location">${dateLocation}</div>`
                } else if (line.startsWith('- ')) {
                  // Achievement bullet point
                  if (!jobHtml.includes('<ul class="description">')) {
                    jobHtml += '<ul class="description">'
                  }
                  jobHtml += `<li>${line.substring(2)}</li>`
                }
              })
              
              if (jobHtml.includes('<ul class="description">')) {
                jobHtml += '</ul>'
              }
              
              jobElement.innerHTML = jobHtml
              jobsContainer.appendChild(jobElement)
            }
          })
        } else if (sectionKey.includes('education')) {
          // Handle education section
          const educationContainer = targetSection as Element
          const existingEducation = educationContainer.querySelectorAll('.education-item')
          
          // Clear existing education
          existingEducation.forEach(edu => edu.remove())
          
          // Add new education
          sectionData.forEach((edu: { title: string; content: string[] }) => {
            if (edu.title) {
              const eduElement = document.createElement('div')
              eduElement.className = 'education-item'
              
              let eduHtml = `<div class="degree">${edu.title}</div>`
              
              edu.content.forEach((line: string) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  // School name
                  const school = line.substring(2, line.length - 2)
                  eduHtml += `<div class="school">${school}</div>`
                } else if (line.startsWith('*') && line.endsWith('*')) {
                  // Details
                  const details = line.substring(1, line.length - 1)
                  eduHtml += `<div class="edu-details">${details}</div>`
                }
              })
              
              eduElement.innerHTML = eduHtml
              educationContainer.appendChild(eduElement)
            }
          })
        } else if (sectionKey.includes('project')) {
          // Handle projects section
          const projectsContainer = targetSection as Element
          const existingProjects = projectsContainer.querySelectorAll('.project')
          
          // Clear existing projects
          existingProjects.forEach(project => project.remove())
          
          // Add new projects
          sectionData.forEach((project: { title: string; content: string[] }) => {
            if (project.title) {
              const projectElement = document.createElement('div')
              projectElement.className = 'project'
              
              let projectHtml = `<div class="project-name">${project.title}</div>`
              
              project.content.forEach((line: string) => {
                if (!line.startsWith('**') && !line.startsWith('*') && !line.startsWith('- ')) {
                  // Project description
                  projectHtml += `<div class="project-desc">${line}</div>`
                } else if (line.startsWith('*') && line.endsWith('*')) {
                  // Technologies
                  const tech = line.substring(1, line.length - 1)
                  projectHtml += `<div class="project-tech">${tech}</div>`
                }
              })
              
              projectElement.innerHTML = projectHtml
              projectsContainer.appendChild(projectElement)
            }
          })
        }
      }
    })
    
    return tempDiv.innerHTML
  }

  // Initialize markdown content when resume is generated
  const initializeMarkdownContent = () => {
    if (generatedResume?.resume) {
      const markdown = htmlToMarkdown(generatedResume.resume)
      setMarkdownContent(markdown)
    }
  }

  // Load sample markdown content for demonstration
  const loadSampleMarkdown = () => {
    const sampleMarkdown = `# John Doe

**Contact:** 📧 john.doe@email.com • 📱 (555) 123-4567 • 📍 San Francisco, CA • GitHub • LinkedIn

## Professional Summary

Experienced software engineer with 5+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-quality solutions using modern technologies.

## Skills

### Technical Skills
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes

### Soft Skills
Leadership, Communication, Problem-solving, Team Management

## Professional Experience

### Senior Software Engineer
**TechCorp Inc.**
*January 2022 - Present • San Francisco, CA*

- Led development of microservices architecture serving 1M+ daily users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored 3 junior developers and conducted code reviews
- Collaborated with product team to define technical requirements

### Software Engineer
**StartupXYZ**
*June 2019 - December 2021 • Remote*

- Built responsive web applications using React and Node.js
- Optimized database queries improving performance by 40%
- Participated in agile development process and sprint planning

## Education

### Bachelor of Science in Computer Science
**University of California**
*Berkeley, CA • May 2019*`

    setMarkdownContent(sampleMarkdown)
  }

  // Load sample skills only for testing
  const loadSampleSkills = () => {
    const currentMarkdown = markdownContent || ''
    
    // Check if skills section already exists
    if (currentMarkdown.toLowerCase().includes('## skills')) {
      // Replace existing skills section
      const lines = currentMarkdown.split('\n')
      const newLines: string[] = []
      let inSkillsSection = false
      let nextSectionFound = false
      
      for (const line of lines) {
        if (line.startsWith('## Skills')) {
          inSkillsSection = true
          newLines.push('## Skills')
          newLines.push('')
          newLines.push('### Technical Skills')
          newLines.push('JavaScript, TypeScript, React, Node.js, Python, AWS, Docker')
          newLines.push('')
          newLines.push('### Soft Skills')
          newLines.push('Leadership, Communication, Problem-solving, Team Management')
          newLines.push('')
        } else if (inSkillsSection && line.startsWith('## ')) {
          inSkillsSection = false
          nextSectionFound = true
          newLines.push(line)
        } else if (!inSkillsSection) {
          newLines.push(line)
        }
      }
      
      setMarkdownContent(newLines.join('\n'))
    } else {
      // Add skills section
      const skillsSection = `

## Skills

### Technical Skills
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker

### Soft Skills
Leadership, Communication, Problem-solving, Team Management
`
      setMarkdownContent(currentMarkdown + skillsSection)
    }
  }

  // Update preview from markdown
  const updatePreviewFromMarkdown = async () => {
    if (!markdownContent || !generatedResume) return
    
    setIsUpdatingPreview(true)
    try {
      // Debug: Log the markdown content being processed
      console.log('Updating preview with markdown:', markdownContent.substring(0, 200) + '...')
      
      // Convert markdown back to HTML
      const updatedHtml = markdownToHtml(markdownContent)
      
      // Debug: Check if skills section exists in the result
      if (markdownContent.toLowerCase().includes('skills')) {
        console.log('Skills section detected in markdown')
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = updatedHtml
        const skillsSection = tempDiv.querySelector('.section .section-title')
        if (skillsSection && skillsSection.textContent?.toLowerCase().includes('skills')) {
          console.log('Skills section found in updated HTML')
        } else {
          console.log('Skills section NOT found in updated HTML')
        }
      }
      
      // Update the generated resume
      setGeneratedResume(prev => prev ? {
        ...prev,
        resume: updatedHtml
      } : null)
      
    } catch (error) {
      console.error('Error updating preview:', error)
      showAlert({
        title: "Preview Update Failed",
        description: "Error updating preview. Please check the console for details and try again.",
        type: "error",
        confirmText: "OK"
      })
    } finally {
      setIsUpdatingPreview(false)
    }
  }

  const generatePreviewHTML = () => {
    const template = getSelectedTemplate()
    if (!template) return ""
    
    // Import the actual template from resume-templates
    if (template.id === 'modern-ats') {
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', 'Helvetica', sans-serif; 
            line-height: 1.5; 
            color: #333333; 
            padding: 20px;
            background: white;
            font-size: 11px;
        }
        .resume-container {
            background: white;
            max-width: 800px;
            margin: 0 auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
            background: #2c3e50;
            color: white;
            text-align: center; 
            padding: 25px 20px;
        }
        .name { 
            font-size: 28px; 
            font-weight: 300; 
            margin-bottom: 4px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .title { 
            font-size: 12px; 
            opacity: 0.9; 
            margin-bottom: 15px;
            font-weight: 400;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .contact { 
            font-size: 10px; 
            opacity: 0.9;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        .contact a { 
            color: #bdc3c7; 
            text-decoration: none;
        }
        .contact a:hover { color: white; }
        .content { 
            padding: 30px;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        .left-column {
            border-right: 1px solid #ecf0f1;
            padding-right: 25px;
        }
        .right-column {
            padding-left: 5px;
        }
        .section { margin-bottom: 25px; }
        .section-title { 
            font-size: 12px; 
            font-weight: 600; 
            color: #2c3e50; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 5px;
        }
        .summary { 
            font-size: 11px; 
            line-height: 1.6; 
            color: #555555; 
            text-align: justify;
            margin-bottom: 20px;
        }
        .job { 
            margin-bottom: 20px; 
            padding-bottom: 15px;
            border-bottom: 1px solid #f8f9fa;
        }
        .job:last-child { border-bottom: none; }
        .job-title { 
            font-weight: 600; 
            font-size: 12px; 
            color: #2c3e50;
            margin-bottom: 2px;
        }
        .company { 
            font-weight: 500; 
            color: #7f8c8d; 
            font-size: 11px;
            margin-bottom: 2px;
        }
        .date-location { 
            font-size: 10px; 
            color: #95a5a6; 
            margin-bottom: 8px;
            font-style: italic;
        }
        .description { 
            margin-left: 0; 
            font-size: 10px; 
            color: #555555;
        }
        .description li { 
            margin-bottom: 4px; 
            position: relative;
            padding-left: 12px;
        }
        .description li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #7f8c8d;
        }
        .skills-list { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 8px; 
            margin-bottom: 15px;
        }
        .skill-item { 
            background: #f8f9fa; 
            padding: 4px 8px; 
            border-radius: 3px; 
            font-size: 9px; 
            color: #555555;
            border: 1px solid #ecf0f1;
        }
        .education-item {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f8f9fa;
        }
        .education-item:last-child { border-bottom: none; }
        .degree { 
            font-weight: 600; 
            font-size: 11px; 
            color: #2c3e50;
            margin-bottom: 2px;
        }
        .school { 
            color: #7f8c8d; 
            font-size: 10px; 
            margin-bottom: 2px;
        }
        .edu-details {
            font-size: 9px;
            color: #95a5a6;
        }
        .contact-info {
            margin-bottom: 20px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 10px;
            color: #555555;
        }
        .contact-icon {
            width: 12px;
            margin-right: 8px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="header">
            <div class="name">${sampleResumeData.personalInfo.name}</div>
            <div class="title">Software Engineer</div>
            <div class="contact">
                <span>${sampleResumeData.personalInfo.email}</span>
                <span>${sampleResumeData.personalInfo.phone}</span>
                <span>${sampleResumeData.personalInfo.location}</span>
                <a href="${sampleResumeData.personalInfo.linkedin}">LinkedIn</a>
                <a href="${sampleResumeData.personalInfo.portfolio}">Portfolio</a>
            </div>
        </div>

        <div class="content">
            <div class="left-column">
                <div class="section">
                    <div class="section-title">Contact</div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-icon">📧</span>
                            <span>${sampleResumeData.personalInfo.email}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📱</span>
                            <span>${sampleResumeData.personalInfo.phone}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📍</span>
                            <span>${sampleResumeData.personalInfo.location}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">🔗</span>
                            <a href="${sampleResumeData.personalInfo.linkedin}" style="color: #555555;">LinkedIn Profile</a>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Skills</div>
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: 600; font-size: 10px; color: #2c3e50; margin-bottom: 6px;">Technical</div>
                        <div class="skills-list">
                            ${sampleResumeData.skills.technical.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                        </div>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 10px; color: #2c3e50; margin-bottom: 6px;">Core Competencies</div>
                        <div class="skills-list">
                            ${sampleResumeData.skills.soft.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Education</div>
                    ${sampleResumeData.education.map(edu => `
                        <div class="education-item">
                            <div class="degree">${edu.degree}</div>
                            <div class="school">${edu.school}</div>
                            <div class="edu-details">${edu.location} • ${edu.graduationDate}</div>
                            ${edu.gpa ? `<div class="edu-details">GPA: ${edu.gpa}</div>` : ''}
                            ${edu.honors ? `<div class="edu-details">${edu.honors.join(', ')}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="right-column">
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <div class="summary">${sampleResumeData.summary}</div>
                </div>

                <div class="section">
                    <div class="section-title">Professional Experience</div>
                    ${sampleResumeData.experience.map(job => `
                        <div class="job">
                            <div class="job-title">${job.title}</div>
                            <div class="company">${job.company}</div>
                            <div class="date-location">${job.startDate} - ${job.endDate} • ${job.location}</div>
                            <ul class="description">
                                ${job.description.map(item => `<li>${item}</li>`).join('')}
                                ${job.achievements.map(achievement => `<li><strong>Achievement:</strong> ${achievement}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>

                ${sampleResumeData.projects && sampleResumeData.projects.length > 0 ? `
                <div class="section">
                    <div class="section-title">Notable Projects</div>
                    ${sampleResumeData.projects.map(project => `
                        <div style="margin-bottom: 15px;">
                            <div style="font-weight: 600; font-size: 11px; color: #2c3e50; margin-bottom: 3px;">
                                ${project.name} ${project.link ? `<a href="${project.link}" style="color: #7f8c8d; font-size: 9px;">[Link]</a>` : ''}
                            </div>
                            <div style="font-size: 10px; color: #555555; margin-bottom: 4px;">${project.description}</div>
                            <div style="font-size: 9px; color: #7f8c8d;">
                                <strong>Technologies:</strong> ${project.technologies.join(', ')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    </div>
</body>
</html>
      `
    } else if (template.id === 'tech-focused') {
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Template Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Consolas', 'Monaco', monospace; 
            line-height: 1.4; 
            color: #2d3748; 
            padding: 20px;
            background: #f7fafc;
            font-size: 11px;
        }
        .container { background: white; padding: 25px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { margin-bottom: 20px; }
        .name { 
            font-size: 22px; 
            font-weight: bold; 
            color: #1a202c; 
            margin-bottom: 6px;
            font-family: 'Arial', sans-serif;
        }
        .title { font-size: 14px; color: #4a5568; margin-bottom: 10px; }
        .contact { font-size: 10px; color: #718096; }
        .contact a { color: #3182ce; text-decoration: none; }
        .section { margin-bottom: 20px; }
        .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            color: #2d3748; 
            margin-bottom: 10px;
            font-family: 'Arial', sans-serif;
            position: relative;
        }
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 30px;
            height: 2px;
            background: #3182ce;
        }
        .summary { 
            font-size: 11px; 
            line-height: 1.6; 
            color: #2d3748; 
            background: #f7fafc;
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid #3182ce;
        }
        .tech-skills { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
            gap: 15px; 
            margin-bottom: 15px;
        }
        .skill-group h4 { 
            color: #2d3748; 
            margin-bottom: 8px; 
            font-size: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
        }
        .skill-items { display: flex; flex-wrap: wrap; gap: 4px; }
        .skill-tag { 
            background: #edf2f7; 
            color: #2d3748; 
            padding: 2px 6px; 
            border-radius: 3px; 
            font-size: 9px;
            border: 1px solid #cbd5e0;
            font-family: 'Consolas', monospace;
        }
        .job { 
            margin-bottom: 18px; 
            padding: 15px;
            border-left: 3px solid #3182ce;
            background: #f7fafc;
        }
        .job-title { font-size: 14px; font-weight: bold; color: #1a202c; }
        .company { font-size: 12px; color: #4a5568; font-weight: 600; }
        .job-meta { font-size: 10px; color: #718096; margin-top: 3px; }
        .achievements { margin-top: 8px; }
        .achievements li { 
            margin-bottom: 5px; 
            color: #2d3748;
            font-size: 10px;
            position: relative;
            padding-left: 15px;
        }
        .achievements li::before {
            content: '▶';
            position: absolute;
            left: 0;
            color: #3182ce;
        }
        .project { 
            background: #f7fafc; 
            padding: 12px; 
            border-radius: 6px; 
            margin-bottom: 12px;
            border-left: 3px solid #38b2ac;
        }
        .project-name { font-weight: bold; color: #1a202c; margin-bottom: 5px; font-size: 12px; }
        .project-desc { font-size: 10px; color: #4a5568; margin-bottom: 6px; }
        .project-tech { margin-top: 6px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="name">${sampleResumeData.personalInfo.name}</div>
            <div class="title">Software Engineer</div>
            <div class="contact">
                📧 ${sampleResumeData.personalInfo.email} • 📱 ${sampleResumeData.personalInfo.phone} • 📍 ${sampleResumeData.personalInfo.location}
                <a href="${sampleResumeData.personalInfo.github}">GitHub</a> • 
                <a href="${sampleResumeData.personalInfo.linkedin}">LinkedIn</a>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${sampleResumeData.summary}</div>
        </div>

        <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="tech-skills">
                <div class="skill-group">
                    <h4>Programming Languages</h4>
                    <div class="skill-items">
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">TypeScript</span>
                        <span class="skill-tag">Python</span>
                    </div>
                </div>
                <div class="skill-group">
                    <h4>Frameworks & Libraries</h4>
                    <div class="skill-items">
                        <span class="skill-tag">React</span>
                        <span class="skill-tag">Node.js</span>
                    </div>
                </div>
                <div class="skill-group">
                    <h4>Tools & Technologies</h4>
                    <div class="skill-items">
                        <span class="skill-tag">AWS</span>
                        <span class="skill-tag">Docker</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Experience</div>
            ${sampleResumeData.experience.map(job => `
                <div class="job">
                    <div class="job-title">${job.title}</div>
                    <div class="company">${job.company}</div>
                    <div class="job-meta">${job.startDate} - ${job.endDate} • ${job.location}</div>
                    <ul class="achievements">
                        ${job.description.map(item => `<li>${item}</li>`).join('')}
                        ${job.achievements.map(achievement => `<li><strong>Impact:</strong> ${achievement}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <div class="section-title">Featured Projects</div>
            ${sampleResumeData.projects?.map(project => `
                <div class="project">
                    <div class="project-name">${project.name} ${project.link ? `<a href="${project.link}" style="color: #3182ce;">🔗</a>` : ''}</div>
                    <div class="project-desc">${project.description}</div>
                    <div class="project-tech">
                        <strong>Tech Stack:</strong> 
                        ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join(' ')}
                    </div>
                </div>
            `).join('') || ''}
        </div>

        <div class="section">
            <div class="section-title">Education</div>
            ${sampleResumeData.education.map(edu => `
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #1a202c; font-size: 12px;">${edu.degree}</div>
                    <div style="color: #4a5568; font-size: 11px;">${edu.school}, ${edu.location}</div>
                    <div style="color: #718096; font-size: 10px;">${edu.graduationDate} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
                    ${edu.honors ? `<div style="color: #2d3748; font-size: 10px; font-style: italic;">${edu.honors.join(', ')}</div>` : ''}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
      `
    } else if (template.id === 'executive') {
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Executive Template Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Georgia', serif; 
            line-height: 1.4; 
            color: #2c3e50; 
            padding: 20px;
            background: white;
            font-size: 11px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 25px; 
            padding: 20px 0;
            border-top: 2px solid #34495e;
            border-bottom: 1px solid #bdc3c7;
        }
        .name { 
            font-size: 24px; 
            font-weight: normal; 
            color: #2c3e50; 
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        .executive-title { 
            font-size: 14px; 
            color: #7f8c8d; 
            margin-bottom: 15px;
            font-style: italic;
        }
        .contact { font-size: 10px; color: #7f8c8d; }
        .contact a { color: #3498db; text-decoration: none; }
        .section { margin-bottom: 25px; }
        .section-title { 
            font-size: 16px; 
            font-weight: normal; 
            color: #2c3e50; 
            margin-bottom: 15px;
            text-align: center;
            position: relative;
        }
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 1px;
            background: #34495e;
        }
        .executive-summary { 
            font-size: 12px; 
            line-height: 1.6; 
            text-align: justify;
            font-style: italic;
            color: #34495e;
            padding: 0 15px;
        }
        .job { 
            margin-bottom: 20px; 
            padding-bottom: 15px;
            border-bottom: 1px solid #ecf0f1;
        }
        .job:last-child { border-bottom: none; }
        .job-title { 
            font-size: 14px; 
            font-weight: bold; 
            color: #2c3e50; 
            margin-bottom: 3px;
        }
        .company { 
            font-size: 12px; 
            color: #7f8c8d; 
            font-weight: normal;
            margin-bottom: 3px;
        }
        .job-meta { 
            font-size: 10px; 
            color: #95a5a6; 
            font-style: italic;
        }
        .achievements { margin-top: 10px; }
        .achievements li { 
            margin-bottom: 6px; 
            color: #34495e;
            font-size: 10px;
        }
        .key-accomplishments {
            background: #f8f9fa;
            padding: 12px;
            border-left: 3px solid #3498db;
            margin: 12px 0;
        }
        .key-accomplishments h4 {
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 11px;
        }
        .skills-executive {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .skill-category h4 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 12px;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 4px;
        }
        .skill-list {
            color: #34495e;
            font-size: 10px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${sampleResumeData.personalInfo.name}</div>
        <div class="executive-title">Senior Executive Leader</div>
        <div class="contact">
            ${sampleResumeData.personalInfo.email} • ${sampleResumeData.personalInfo.phone} • ${sampleResumeData.personalInfo.location}
            <a href="${sampleResumeData.personalInfo.linkedin}">LinkedIn Profile</a>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="executive-summary">${sampleResumeData.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">Leadership Experience</div>
        ${sampleResumeData.experience.map(job => `
            <div class="job">
                <div class="job-title">${job.title}</div>
                <div class="company">${job.company}</div>
                <div class="job-meta">${job.startDate} - ${job.endDate} • ${job.location}</div>
                <ul class="achievements">
                    ${job.description.map(item => `<li>${item}</li>`).join('')}
                </ul>
                ${job.achievements.length > 0 ? `
                <div class="key-accomplishments">
                    <h4>Key Accomplishments</h4>
                    <ul>
                        ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Core Competencies</div>
        <div class="skills-executive">
            <div class="skill-category">
                <h4>Leadership & Strategy</h4>
                <div class="skill-list">
                    ${sampleResumeData.skills.soft.join(' • ')}
                </div>
            </div>
            <div class="skill-category">
                <h4>Technical Expertise</h4>
                <div class="skill-list">
                    ${sampleResumeData.skills.technical.join(' • ')}
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Education & Credentials</div>
        ${sampleResumeData.education.map(edu => `
            <div style="margin-bottom: 20px;">
                <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">${edu.degree}</div>
                <div style="color: #7f8c8d; margin-top: 5px; font-size: 12px;">${edu.school}, ${edu.location} • ${edu.graduationDate}</div>
                ${edu.gpa ? `<div style="color: #34495e; font-size: 11px; margin-top: 3px;">GPA: ${edu.gpa}</div>` : ''}
                ${edu.honors ? `<div style="color: #34495e; font-style: italic; margin-top: 5px; font-size: 11px;">${edu.honors.join(', ')}</div>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>
      `
    }
    
    return "<p>Preview not available for this template</p>"
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Return Home Button */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="flex items-center space-x-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Button>
        
        <div className="flex items-center space-x-4">
          {/* Loading indicator */}
          {isLoadingProfile && (
            <div className="flex items-center space-x-2 text-orange-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
              <span className="text-sm">Loading your data...</span>
            </div>
          )}
          
          {/* Save Profile Button for authenticated users */}
          {session?.user && hasLoadedProfile && (
            <Button 
              onClick={saveUserProfile}
              variant="outline"
              className="flex items-center space-x-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </Button>
          )}
          
          <div className="text-right">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Resume Optimizer
            </h1>
            <div className="flex items-center justify-end space-x-2">
              <p className="text-gray-600 text-sm">Create ATS-optimized resumes tailored for your target role</p>
              {session?.user && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <User className="h-3 w-3" />
                  <span>Signed in as {session.user.name || session.user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-200 rounded-lg p-1">
          <TabsTrigger 
            value="templates" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            1. Choose Template
          </TabsTrigger>
          <TabsTrigger 
            value="data"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            2. Enter Details
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            3. Preview & Download
          </TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Choose Your Template</span>
              </CardTitle>
              <CardDescription>
                Select a professional template optimized for your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg' 
                        : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-orange-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {categoryIcons[template.category]}
                          <h3 className="font-semibold">{template.name}</h3>
                        </div>
                        {template.atsOptimized && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            ATS
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${categoryColors[template.category]}`}
                      >
                        {template.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Template Preview Section */}
              {selectedTemplate && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Template Preview</h3>
                    <Badge variant="outline" className="text-xs">
                      {getSelectedTemplate()?.name}
                    </Badge>
                  </div>
                  <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="p-4">
                      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                        <div 
                          className="w-full overflow-hidden"
                          style={{ 
                            height: '600px',
                            background: 'white'
                          }}
                        >
                          <iframe
                            srcDoc={generatePreviewHTML()}
                            className="w-full h-full border-0"
                            style={{
                              transform: 'scale(0.75)',
                              transformOrigin: 'top left',
                              width: '133.33%',
                              height: '133.33%'
                            }}
                            title="Resume Template Preview"
                          />
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                          This is a preview with sample data. Your actual resume will use your information.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setActiveTab('data')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Next: Enter Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resume Data Entry */}
        <TabsContent value="data" className="space-y-8">
          {/* Data Pre-fill Notification */}
          {hasLoadedProfile && (
            <Card className={`border-2 ${isPrefilledFromAnalysis ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {isPrefilledFromAnalysis ? (
                      <Sparkles className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${isPrefilledFromAnalysis ? 'text-green-900' : 'text-blue-900'} mb-1`}>
                      {isPrefilledFromAnalysis ? 'AI-Optimized Resume Data Loaded!' : (session?.user ? 'Profile Data Loaded' : 'Previous Data Restored')}
                    </h4>
                    <p className={`text-xs ${isPrefilledFromAnalysis ? 'text-green-700' : 'text-blue-700'}`}>
                      {isPrefilledFromAnalysis ? (
                        <>
                          Your resume data has been extracted and optimized using AI analysis. 
                          The form below is pre-filled with improved content based on your original resume and analysis insights. 
                          <strong className="font-medium"> Simply select a template and generate your optimized resume!</strong>
                        </>
                      ) : (
                        session?.user 
                          ? 'Your profile information has been automatically loaded. You can modify any details below and they will be saved to your account.'
                          : 'Your previous resume data has been restored from local storage. All changes will be saved locally.'
                      )}
                    </p>
                    {isPrefilledFromAnalysis && (
                      <div className="mt-3 flex space-x-2">
                        <Button 
                          onClick={() => setActiveTab('preview')}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Quick Generate
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('templates')}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50 text-xs"
                        >
                          Choose Template First
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hero Section for Enter Details */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Build Your Perfect Resume
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fill in your details and job description to create an ATS-optimized resume tailored for your target role
            </p>
          </div>

          {/* Job Description Section - Now at the top */}
          <Card className="border-2 border-orange-100 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Target Job Description</span>
              </CardTitle>
              <CardDescription className="text-orange-100">
                Paste the job description to optimize your resume for this specific role
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. Include requirements, responsibilities, and preferred qualifications..."
                rows={8}
                className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {jobDescription.length} characters
                </div>
                <div className="text-sm text-orange-600 font-medium">
                  {jobDescription.trim() ? '✓ Job description added' : 'Job description required for optimization'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-orange-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value }
                      }))}
                      placeholder="John Doe"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                      placeholder="john@example.com"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                      placeholder="+1 (555) 123-4567"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                      placeholder="San Francisco, CA"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin" className="text-gray-700 font-medium">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/in/johndoe"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio" className="text-gray-700 font-medium">Portfolio/Website</Label>
                    <Input
                      id="portfolio"
                      value={resumeData.personalInfo.portfolio || ''}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                      }))}
                      placeholder="https://johndoe.com"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Professional Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    summary: e.target.value
                  }))}
                  placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
                  rows={8}
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Include keywords from the job description above
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Skills */}
          <Card className="border-2 border-orange-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Skills & Expertise</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="technical-skills" className="text-gray-700 font-medium">Technical Skills</Label>
                  <Textarea
                    id="technical-skills"
                    value={technicalSkillsInput}
                    onChange={(e) => {
                      setTechnicalSkillsInput(e.target.value)
                      updateSkills('technical', e.target.value)
                    }}
                    placeholder="JavaScript, React, Node.js, Python, AWS, Docker..."
                    rows={4}
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">Separate skills with commas</p>
                    {technicalSkillsInput && (
                      <div className="text-xs text-green-600">
                        ✓ {parseSkills(technicalSkillsInput).length} skills detected: {parseSkills(technicalSkillsInput).slice(0, 3).join(', ')}{parseSkills(technicalSkillsInput).length > 3 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="soft-skills" className="text-gray-700 font-medium">Soft Skills</Label>
                  <Textarea
                    id="soft-skills"
                    value={softSkillsInput}
                    onChange={(e) => {
                      setSoftSkillsInput(e.target.value)
                      updateSkills('soft', e.target.value)
                    }}
                    placeholder="Leadership, Communication, Problem-solving, Team Management..."
                    rows={4}
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">Separate skills with commas</p>
                    {softSkillsInput && (
                      <div className="text-xs text-green-600">
                        ✓ {parseSkills(softSkillsInput).length} skills detected: {parseSkills(softSkillsInput).slice(0, 3).join(', ')}{parseSkills(softSkillsInput).length > 3 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Experience */}
          <Card className="border-2 border-orange-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <span>Professional Experience</span>
                </div>
                <Button 
                  onClick={addExperience} 
                  variant="outline" 
                  size="sm"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border-2 border-orange-100 rounded-lg p-6 space-y-4 bg-gradient-to-br from-orange-25 to-red-25 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm mr-2">
                        {index + 1}
                      </span>
                      Experience {index + 1}
                    </h4>
                    {resumeData.experience.length > 1 && (
                      <Button
                        onClick={() => setResumeData(prev => ({
                          ...prev,
                          experience: prev.experience.filter((_, i) => i !== index)
                        }))}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        placeholder="Senior Software Engineer"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        placeholder="TechCorp Inc."
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        placeholder="San Francisco, CA"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        placeholder="Jan 2022"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        placeholder="Present"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Job Description & Achievements</Label>
                    <Textarea
                      value={exp.description.join('\n')}
                      onChange={(e) => updateExperience(index, 'description', e.target.value.split('\n').filter(line => line.trim()))}
                      placeholder="• Led development of microservices architecture&#10;• Mentored junior developers&#10;• Implemented CI/CD pipelines"
                      rows={5}
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Each line will become a bullet point. Include quantifiable achievements!</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-2 border-orange-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span>Education</span>
                </div>
                <Button 
                  onClick={addEducation} 
                  variant="outline" 
                  size="sm"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="border-2 border-orange-100 rounded-lg p-6 space-y-4 bg-gradient-to-br from-orange-25 to-red-25 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm mr-2">
                        {index + 1}
                      </span>
                      Education {index + 1}
                    </h4>
                    {resumeData.education.length > 1 && (
                      <Button
                        onClick={() => setResumeData(prev => ({
                          ...prev,
                          education: prev.education.filter((_, i) => i !== index)
                        }))}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">School</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        placeholder="University of California"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(index, 'location', e.target.value)}
                        placeholder="Berkeley, CA"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Graduation Date</Label>
                      <Input
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                        placeholder="May 2019"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">GPA (Optional)</Label>
                      <Input
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        placeholder="3.8"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('templates')}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Templates
            </Button>
            <Button 
              onClick={generateOptimizedResume}
              disabled={isGenerating || !jobDescription.trim() || !resumeData.personalInfo.name || !resumeData.personalInfo.email}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white disabled:from-gray-400 disabled:to-gray-500 px-8 py-3 text-lg font-semibold shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>Generating Your Resume...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  <span>Generate Optimized Resume</span>
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Preview & Download */}
        <TabsContent value="preview" className="space-y-6">
          {generatedResume ? (
            <>
              {/* Optimization Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-semibold">ATS Score</div>
                        <div className="text-2xl font-bold text-green-600">
                          {generatedResume.optimizations.atsScore}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">Keywords Found</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {generatedResume.optimizations.keywordsFound.length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-semibold">Suggestions</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {generatedResume.optimizations.suggestions.length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions */}
              {generatedResume.optimizations.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Optimization Suggestions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedResume.optimizations.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Resume Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Resume Preview</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          if (isEditMode) {
                            updatePreviewFromMarkdown()
                          } else {
                            initializeMarkdownContent()
                          }
                          setIsEditMode(!isEditMode)
                        }}
                        variant="outline"
                        className="flex items-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        {isEditMode ? (
                          <>
                            <Eye className="h-4 w-4" />
                            <span>Preview Mode</span>
                          </>
                        ) : (
                          <>
                            <Edit3 className="h-4 w-4" />
                            <span>Edit Mode</span>
                          </>
                        )}
                      </Button>
                      <div className="flex space-x-1">
                        <Button 
                          onClick={downloadResume} 
                          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download HTML</span>
                        </Button>
                        <Button 
                          onClick={downloadAsText}
                          variant="outline"
                          className="flex items-center space-x-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          <Download className="h-4 w-4" />
                          <span>ATS Text</span>
                        </Button>
                      </div>
                      <Button 
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          if (printWindow) {
                            printWindow.document.write(generatedResume.resume);
                            printWindow.document.close();
                            printWindow.focus();
                          }
                        }}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Full View</span>
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditMode ? (
                    <div className="space-y-4">
                      {/* Edit Mode Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Edit3 className="h-5 w-5 text-blue-600 mt-0.5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                              Edit Your Resume Content
                            </h4>
                            <p className="text-sm text-blue-700 mb-2">
                              Use this simple format to edit your resume. No HTML knowledge required!
                            </p>
                            <div className="text-xs text-blue-600 space-y-1 mb-3">
                              <div><code className="bg-blue-100 px-1 rounded"># Name</code> - Your full name</div>
                              <div><code className="bg-blue-100 px-1 rounded">## Section Title</code> - Main sections (Experience, Education, etc.)</div>
                              <div><code className="bg-blue-100 px-1 rounded">### Job Title</code> - Job titles, degrees, project names</div>
                              <div><code className="bg-blue-100 px-1 rounded">**Company Name**</code> - Company names, schools</div>
                              <div><code className="bg-blue-100 px-1 rounded">*Date Range*</code> - Dates and locations</div>
                              <div><code className="bg-blue-100 px-1 rounded">- Bullet point</code> - Achievements and responsibilities</div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={loadSampleMarkdown}
                                size="sm"
                                variant="outline"
                                className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                              >
                                Load Sample Content
                              </Button>
                              <Button
                                onClick={loadSampleSkills}
                                size="sm"
                                variant="outline"
                                className="text-xs border-green-300 text-green-700 hover:bg-green-50"
                              >
                                Load Sample Skills
                              </Button>
                              <Button
                                onClick={() => setMarkdownContent('')}
                                size="sm"
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Clear All
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Markdown Editor */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Edit Content
                            </Label>
                            <Button
                              onClick={updatePreviewFromMarkdown}
                              disabled={isUpdatingPreview}
                              size="sm"
                              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {isUpdatingPreview ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  <span>Updating...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="h-3 w-3" />
                                  <span>Update Preview</span>
                                </>
                              )}
                            </Button>
                          </div>
                          <Textarea
                            value={markdownContent}
                            onChange={(e) => setMarkdownContent(e.target.value)}
                            className="font-mono text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            rows={25}
                            placeholder="Your resume content will appear here..."
                          />
                          <div className="mt-2 text-xs text-gray-500">
                            {markdownContent.length} characters • Make changes and click "Update Preview" to see results
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Live Preview
                            </Label>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg border">
                            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                              <iframe
                                srcDoc={generatedResume.resume}
                                className="w-full border-0"
                                style={{
                                  height: '600px',
                                  minHeight: '600px'
                                }}
                                title="Resume Preview"
                                sandbox="allow-same-origin"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                        <iframe
                          srcDoc={generatedResume.resume}
                          className="w-full border-0"
                          style={{
                            height: '600px',
                            minHeight: '600px'
                          }}
                          title="Resume Preview"
                          sandbox="allow-same-origin"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                          Preview of your optimized resume. Use "Edit Mode" to make changes, "Open Full View" to see it in a new tab, or "Download HTML" to save the file.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Resume Generated Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete the previous steps to generate your optimized resume
                </p>
                <Button 
                  onClick={() => setActiveTab('data')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Go to Enter Details
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Alert Dialog */}
      {AlertDialog}
    </div>
  )
} 