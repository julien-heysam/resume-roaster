import ResumeOptimizer from "@/components/ui/resume-optimizer"
import { Footer } from "@/components/ui/footer"
import { Navigation } from "@/components/ui/navigation"

export default function ResumeOptimizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col">
      {/* Navigation */}
      <Navigation currentPage="resume-optimizer" />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Hero Header */}
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Resume Optimizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Generate ATS-optimized resumes tailored to specific job descriptions with professional templates
          </p>
        </div> */}
        
        <ResumeOptimizer />
      </div>
      
      <Footer />
    </div>
  )
} 