import { Metadata } from "next"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, TrendingUp, Brain, Target, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog - Resume Roaster",
  description: "Expert insights on AI-powered resume optimization, career development, and job search strategies from the Resume Roaster team.",
}

export default function BlogPage() {
  const featuredPost = {
    title: "The Future of Resume Screening: How AI is Revolutionizing Recruitment",
    excerpt: "Discover how machine learning algorithms are changing the way companies evaluate resumes and what this means for job seekers in 2025.",
    author: "Julien Wuthrich",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "AI & Technology",
    image: "/api/placeholder/800/400",
    slug: "future-of-resume-screening-ai"
  }

  const blogPosts = [
    {
      title: "10 ATS Optimization Secrets That Actually Work",
      excerpt: "Learn the insider tricks to make your resume pass through Applicant Tracking Systems and land on a recruiter's desk.",
      author: "Julien Wuthrich",
      date: "2025-01-12",
      readTime: "6 min read",
      category: "Resume Tips",
      slug: "ats-optimization-secrets"
    },
    {
      title: "Machine Learning Engineer Resume: A Complete Guide",
      excerpt: "From technical skills to project descriptions, here's how to craft a resume that gets you noticed in the AI industry.",
      author: "Julien Wuthrich",
      date: "2025-01-10",
      readTime: "12 min read",
      category: "Industry Guides",
      slug: "machine-learning-engineer-resume-guide"
    },
    {
      title: "Why Your Resume Gets Rejected in 6 Seconds",
      excerpt: "Understanding the psychology of resume screening and how to make those crucial first seconds count.",
      author: "Resume Roaster Team",
      date: "2025-01-08",
      readTime: "5 min read",
      category: "Career Psychology",
      slug: "resume-rejected-6-seconds"
    },
    {
      title: "E-commerce Career Paths: From Startup to Enterprise",
      excerpt: "Navigate the diverse opportunities in e-commerce, from technical roles to business strategy positions.",
      author: "Julien Wuthrich",
      date: "2025-01-05",
      readTime: "9 min read",
      category: "Career Paths",
      slug: "ecommerce-career-paths"
    },
    {
      title: "The Art of Technical Resume Writing",
      excerpt: "How to showcase complex technical projects in a way that both engineers and HR professionals can understand.",
      author: "Julien Wuthrich",
      date: "2025-01-03",
      readTime: "7 min read",
      category: "Technical Writing",
      slug: "technical-resume-writing"
    },
    {
      title: "Customer Support to Tech: A Career Transition Guide",
      excerpt: "Leveraging customer support experience to break into technical roles - a complete roadmap.",
      author: "Resume Roaster Team",
      date: "2025-01-01",
      readTime: "10 min read",
      category: "Career Transition",
      slug: "customer-support-to-tech"
    }
  ]

  const categories = [
    { name: "AI & Technology", count: 12, icon: <Brain className="h-4 w-4" /> },
    { name: "Resume Tips", count: 18, icon: <Target className="h-4 w-4" /> },
    { name: "Career Paths", count: 8, icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Industry Guides", count: 15, icon: <Zap className="h-4 w-4" /> },
    { name: "Technical Writing", count: 6, icon: <User className="h-4 w-4" /> },
    { name: "Career Transition", count: 9, icon: <ArrowRight className="h-4 w-4" /> }
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
            Resume Roaster Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert insights on AI-powered resume optimization, career development, and the future of work.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <div className="mb-12">
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <Badge className="bg-white text-orange-500 mb-4">Featured</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                    <p className="text-lg opacity-90 mb-6">{featuredPost.excerpt}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredPost.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    {featuredPost.category}
                  </Badge>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-orange-500 transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full hover:bg-orange-50 hover:border-orange-200">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <Card className="border-0 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Stay Updated</CardTitle>
                <CardDescription>
                  Get the latest insights on AI, careers, and resume optimization delivered to your inbox.
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
                  No spam, unsubscribe at any time.
                </p>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card className="border-0 shadow-lg mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Popular This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-sm leading-tight hover:text-orange-500 cursor-pointer transition-colors mb-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                      <Clock className="h-3 w-3 ml-2" />
                      {post.readTime}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 