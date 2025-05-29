import { Metadata } from "next"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Users, Zap, Heart, Brain, Target, ArrowRight, Building, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers - Resume Roaster",
  description: "Join our mission to revolutionize career development through AI. Explore exciting opportunities in machine learning, engineering, and more.",
}

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Machine Learning Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$150k - $200k",
      description: "Lead the development of our AI-powered resume analysis algorithms. Work with cutting-edge NLP models to provide actionable career insights.",
      requirements: [
        "5+ years of ML engineering experience",
        "Expertise in Python, TensorFlow/PyTorch",
        "Experience with NLP and text analysis",
        "Strong background in production ML systems"
      ],
      skills: ["Python", "Machine Learning", "NLP", "TensorFlow", "AWS"]
    },
    {
      title: "Full Stack Engineer",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Build and scale our web platform using Next.js, React, and modern cloud technologies. Create seamless user experiences for career optimization.",
      requirements: [
        "3+ years of full-stack development",
        "Proficiency in React, Next.js, TypeScript",
        "Experience with cloud platforms (AWS/Vercel)",
        "Strong API design and database skills"
      ],
      skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"]
    },
    {
      title: "Product Manager - AI Features",
      department: "Product",
      location: "Remote / London",
      type: "Full-time",
      salary: "$130k - $170k",
      description: "Drive product strategy for our AI-powered features. Work closely with ML engineers to translate user needs into innovative solutions.",
      requirements: [
        "4+ years of product management experience",
        "Background in AI/ML products",
        "Strong analytical and communication skills",
        "Experience with B2B SaaS products"
      ],
      skills: ["Product Strategy", "AI/ML", "Analytics", "User Research", "Agile"]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote / Austin",
      type: "Full-time",
      salary: "$80k - $110k",
      description: "Help our users maximize their career potential through Resume Roaster. Build relationships and drive product adoption.",
      requirements: [
        "2+ years in customer success or support",
        "Experience with SaaS platforms",
        "Excellent communication skills",
        "Passion for helping others succeed"
      ],
      skills: ["Customer Success", "SaaS", "Communication", "Analytics", "CRM"]
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote / Berlin",
      type: "Full-time",
      salary: "$110k - $150k",
      description: "Scale our infrastructure to handle millions of resume analyses. Implement robust CI/CD pipelines and monitoring systems.",
      requirements: [
        "3+ years of DevOps experience",
        "Expertise in AWS, Docker, Kubernetes",
        "Experience with CI/CD pipelines",
        "Strong scripting and automation skills"
      ],
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Python"]
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "Remote / Toronto",
      type: "Full-time",
      salary: "$70k - $100k",
      description: "Create compelling content that educates job seekers about AI-powered career optimization. Drive organic growth through strategic content.",
      requirements: [
        "3+ years of content marketing experience",
        "Strong writing and editing skills",
        "SEO and analytics expertise",
        "Experience in B2B SaaS marketing"
      ],
      skills: ["Content Marketing", "SEO", "Analytics", "Writing", "Social Media"]
    }
  ]

  const benefits = [
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world. We believe great talent isn't limited by geography."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Learning & Development",
      description: "$3,000 annual learning budget for courses, conferences, and professional development."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness stipend."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Cutting-Edge Tech",
      description: "Work with the latest AI technologies and have access to premium development tools."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Equity & Growth",
      description: "Meaningful equity participation and clear career progression paths."
    },
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      title: "Impact-Driven Work",
      description: "Help millions of people advance their careers and achieve their professional goals."
    }
  ]

  const companyValues = [
    {
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI and career technology."
    },
    {
      title: "Radical Transparency",
      description: "We believe in honest feedback, open communication, and transparent decision-making."
    },
    {
      title: "User Obsession",
      description: "Every decision we make is driven by what's best for our users' career success."
    },
    {
      title: "Continuous Learning",
      description: "We're always learning, growing, and adapting to serve our mission better."
    }
  ]

  const stats = [
    { number: "25+", label: "Team Members" },
    { number: "12", label: "Countries" },
    { number: "50M+", label: "Resumes Analyzed" },
    { number: "4.9/5", label: "Employee Rating" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Help us revolutionize how people approach their careers through AI-powered insights and tools. 
            Build the future of work with a team that's passionate about making career success accessible to everyone.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-500">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Work With Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    {benefit.icon}
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {position.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {position.salary}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 shrink-0">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">{position.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-gray-600 text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {position.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="bg-orange-100 text-orange-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Our Hiring Process
              </CardTitle>
              <CardDescription className="text-lg">
                We believe in a fair, transparent, and efficient hiring process that respects your time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Application</h3>
                  <p className="text-gray-600 text-sm">Submit your resume and cover letter through our portal</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Screening</h3>
                  <p className="text-gray-600 text-sm">Initial phone/video call with our talent team</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical</h3>
                  <p className="text-gray-600 text-sm">Technical interview or take-home challenge</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    4
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Final Round</h3>
                  <p className="text-gray-600 text-sm">Meet the team and discuss your future with us</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Don't See the Perfect Role?</h2>
              <p className="text-xl mb-8 opacity-90">
                We're always looking for exceptional talent. Send us your resume and let's talk about how you can contribute to our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
                  Send General Application
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-500">
                  Join Our Talent Pool
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
} 