import { Metadata } from "next"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, ExternalLink, Mail, Phone, Globe, Award, TrendingUp, Users, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Press - Resume Roaster",
  description: "Latest news, media coverage, and press resources for Resume Roaster, the AI-powered resume optimization platform.",
}

export default function PressPage() {
  const pressReleases = [
    {
      title: "Resume Roaster Raises $5M Series A to Democratize AI-Powered Career Development",
      date: "2024-01-15",
      excerpt: "Leading venture capital firms invest in Resume Roaster's mission to make professional career guidance accessible through artificial intelligence.",
      category: "Funding",
      link: "#"
    },
    {
      title: "Resume Roaster Surpasses 1 Million Resume Analyses, Reports 85% Interview Rate Improvement",
      date: "2024-01-08",
      excerpt: "Platform milestone demonstrates growing demand for AI-powered career optimization tools among job seekers worldwide.",
      category: "Milestone",
      link: "#"
    },
    {
      title: "Resume Roaster Launches Advanced AI Resume Optimizer with Industry-Specific Templates",
      date: "2023-12-20",
      excerpt: "New feature leverages machine learning to generate ATS-optimized resumes tailored to specific job descriptions and industries.",
      category: "Product",
      link: "#"
    },
    {
      title: "Resume Roaster Named 'Best AI Career Tool' by TechCrunch Disrupt 2023",
      date: "2023-12-15",
      excerpt: "Recognition highlights platform's innovative approach to solving resume optimization challenges through artificial intelligence.",
      category: "Award",
      link: "#"
    }
  ]

  const mediaCoverage = [
    {
      publication: "TechCrunch",
      title: "How AI is Revolutionizing the Job Search Process",
      date: "2024-01-12",
      type: "Feature Article",
      link: "#"
    },
    {
      publication: "Forbes",
      title: "The Future of Career Development: AI-Powered Resume Optimization",
      date: "2024-01-10",
      type: "Opinion Piece",
      link: "#"
    },
    {
      publication: "Wired",
      title: "Machine Learning Engineer Turns Resume Feedback Into a Science",
      date: "2024-01-05",
      type: "Profile",
      link: "#"
    },
    {
      publication: "Harvard Business Review",
      title: "Why Traditional Resume Services Are Failing Job Seekers",
      date: "2023-12-28",
      type: "Analysis",
      link: "#"
    },
    {
      publication: "VentureBeat",
      title: "Resume Roaster's AI Approach to Career Optimization",
      date: "2023-12-20",
      type: "Interview",
      link: "#"
    },
    {
      publication: "The Verge",
      title: "Can AI Really Make Your Resume Better?",
      date: "2023-12-15",
      type: "Review",
      link: "#"
    }
  ]

  const companyStats = [
    { number: "1M+", label: "Resumes Analyzed", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "85%", label: "Interview Rate Increase", icon: <Award className="h-6 w-6" /> },
    { number: "120+", label: "Countries Served", icon: <Globe className="h-6 w-6" /> },
    { number: "500K+", label: "Active Users", icon: <Users className="h-6 w-6" /> }
  ]

  const awards = [
    {
      title: "Best AI Career Tool 2023",
      organization: "TechCrunch Disrupt",
      date: "December 2023",
      description: "Recognized for innovative AI-powered approach to resume optimization"
    },
    {
      title: "Top 50 AI Startups to Watch",
      organization: "AI Business Magazine",
      date: "November 2023",
      description: "Selected for revolutionary impact on career development industry"
    },
    {
      title: "Innovation in HR Technology",
      organization: "HR Tech Awards",
      date: "October 2023",
      description: "Honored for advancing recruitment and career development through AI"
    }
  ]

  const pressKit = [
    {
      title: "Company Fact Sheet",
      description: "Key statistics, milestones, and company information",
      format: "PDF",
      size: "2.1 MB"
    },
    {
      title: "High-Resolution Logos",
      description: "Brand assets in various formats and sizes",
      format: "ZIP",
      size: "15.3 MB"
    },
    {
      title: "Executive Photos",
      description: "Professional headshots of leadership team",
      format: "ZIP",
      size: "8.7 MB"
    },
    {
      title: "Product Screenshots",
      description: "High-quality images of platform interface",
      format: "ZIP",
      size: "12.4 MB"
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Press & Media
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Latest news, media coverage, and resources about Resume Roaster's mission to revolutionize 
            career development through AI-powered resume optimization.
          </p>
        </div>

        {/* Company Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3 text-orange-500">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Press Releases */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {release.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              {formatDate(release.date)}
                            </div>
                          </div>
                          <CardTitle className="text-xl leading-tight hover:text-orange-500 transition-colors cursor-pointer">
                            {release.title}
                          </CardTitle>
                          <CardDescription className="text-gray-600 leading-relaxed mt-3">
                            {release.excerpt}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="hover:bg-orange-50 hover:border-orange-200">
                        Read Full Release
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Media Coverage */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Coverage</h2>
              <div className="space-y-4">
                {mediaCoverage.map((article, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {article.publication}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {article.type}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 hover:text-orange-500 transition-colors cursor-pointer mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.date)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Awards & Recognition */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Awards & Recognition</h2>
              <div className="space-y-6">
                {awards.map((award, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <Award className="h-6 w-6 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{award.title}</h3>
                          <p className="text-orange-500 font-medium text-sm mb-2">{award.organization}</p>
                          <p className="text-gray-600 text-sm mb-2">{award.description}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {award.date}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Press Contact */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Press Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Media Inquiries</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href="mailto:press@resumeroaster.com" className="text-orange-500 hover:underline">
                        press@resumeroaster.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Business Inquiries</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href="mailto:business@resumeroaster.com" className="text-orange-500 hover:underline">
                        business@resumeroaster.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Press Kit */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Press Kit</CardTitle>
                <CardDescription>
                  Download our media assets and company information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pressKit.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-gray-600 text-xs">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.format}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.size}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-4">
                  Download Complete Press Kit
                  <Download className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">Founded:</span>
                  <span className="text-gray-600 ml-2">2023</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Headquarters:</span>
                  <span className="text-gray-600 ml-2">San Francisco, CA</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Founder & CEO:</span>
                  <span className="text-gray-600 ml-2">Julien Wuthrich</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Industry:</span>
                  <span className="text-gray-600 ml-2">AI-Powered Career Development</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Funding:</span>
                  <span className="text-gray-600 ml-2">$5M Series A</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Team Size:</span>
                  <span className="text-gray-600 ml-2">25+ employees</span>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Press Updates</CardTitle>
                <CardDescription>
                  Subscribe to receive our latest press releases and company news
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  For media professionals only. Unsubscribe at any time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 