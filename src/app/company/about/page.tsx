import { Metadata } from "next"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Target, Users, Award, Zap, Brain, Heart, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - Resume Roaster",
  description: "Learn about Resume Roaster's mission to revolutionize resume optimization through AI-powered analysis and feedback.",
}

export default function AboutPage() {
  const values = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "AI-First Innovation",
      description: "We leverage cutting-edge machine learning to provide insights that traditional resume services simply can't match."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Brutally Honest",
      description: "We believe in honest feedback that helps you grow, not sugar-coated reviews that waste your time."
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Results-Driven",
      description: "Every feature we build is designed to get you more interviews and better job opportunities."
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-500" />,
      title: "Accessible to All",
      description: "Great career advice shouldn't be limited to those who can afford expensive career coaches."
    }
  ]

  const stats = [
    { number: "500+", label: "Resumes Analyzed" },
    { number: "80%", label: "Interview Rate Increase" },
    { number: "3+", label: "Countries Served" },
    { number: "4.9/5", label: "User Rating" }
  ]

  const team = [
    {
      name: "Julien Wuthrich",
      role: "Founder & CEO",
      bio: "Machine Learning Engineer with 8+ years of experience at companies like Gorgias, Renault Digital, and Xerox. Passionate about using AI to democratize career success.",
      expertise: ["Machine Learning", "E-commerce", "Customer Support", "AI/ML Systems"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Flame className="h-16 w-16 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About Resume Roaster
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to revolutionize how people approach their careers by providing 
            AI-powered, brutally honest resume feedback that actually gets results.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Too many talented professionals are held back by poorly optimized resumes. Traditional resume 
                services are expensive, slow, and often provide generic advice. We believe everyone deserves 
                access to world-class career guidance powered by the latest advances in artificial intelligence.
              </p>
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">
                  "We're not here to make you feel good about a bad resume. We're here to make your resume so good, 
                  you'll feel confident applying to your dream job."
                </p>
                <p className="text-sm text-gray-600 mt-2">- Julien Wuthrich, Founder</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    {value.icon}
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-gray-900 mb-2">{member.name}</CardTitle>
                      <CardDescription className="text-lg text-orange-500 font-semibold mb-4">
                        {member.role}
                      </CardDescription>
                      <p className="text-gray-600 leading-relaxed mb-4">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="bg-orange-100 text-orange-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Powered by Advanced AI
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
                Our platform leverages state-of-the-art machine learning models, including GPT-4 and Claude, 
                to provide analysis that goes far beyond simple keyword matching. We understand context, 
                industry nuances, and what actually makes recruiters take notice.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">Get comprehensive feedback in under 60 seconds</p>
                </div>
                <div className="text-center">
                  <Target className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Precision Analysis</h3>
                  <p className="text-gray-600 text-sm">AI-powered insights tailored to your industry</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
                  <p className="text-gray-600 text-sm">85% of users see improved interview rates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Resume?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of professionals who've already upgraded their careers with Resume Roaster.
              </p>
              <a 
                href="/" 
                className="inline-flex items-center gap-2 bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Now
                <Flame className="h-5 w-5" />
              </a>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
} 