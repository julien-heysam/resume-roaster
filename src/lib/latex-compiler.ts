import { ResumeData } from './resume-templates'
import { getLatexTemplate } from './latex-templates'

export interface LaTeXCompilationResult {
  success: boolean
  pdfBuffer?: Buffer
  error?: string
  logs?: string
}

// Main compilation function
export async function compileLatexToPDF(
  templateId: string, 
  resumeData: ResumeData
): Promise<LaTeXCompilationResult> {
  try {
    const template = getLatexTemplate(templateId)
    if (!template) {
      return { success: false, error: 'Template not found' }
    }

    const latexSource = template.generateLaTeX(resumeData)
    
    // Use our proxy API endpoint which handles external service calls server-side
    // This avoids CORS issues that occur when calling external services from the browser
    return await compileWithAlternativeService(latexSource)
    
  } catch (error) {
    return { 
      success: false, 
      error: `Compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}

// Note: Direct external service calls removed due to CORS restrictions
// All external LaTeX compilation services are now accessed server-side
// through our proxy API endpoint (/api/latex/compile-proxy)

// Alternative cloud service using a different approach
async function compileWithAlternativeService(latexSource: string): Promise<LaTeXCompilationResult> {
  try {
    // Use a different approach - compile via a proxy service
    const response = await fetch('/api/latex/compile-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        source: latexSource,
        engine: 'pdflatex'
      })
    })

    if (response.ok) {
      const result = await response.json()
      if (result.success && result.pdf) {
        return {
          success: true,
          pdfBuffer: Buffer.from(result.pdf, 'base64')
        }
      } else {
        return {
          success: false,
          error: result.error || 'Compilation failed',
          logs: result.logs
        }
      }
    } else {
      return {
        success: false,
        error: `Alternative service failed: ${response.statusText}. Please download the LaTeX source and compile manually.`
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `All compilation services failed. Please download the LaTeX source (.tex file) and compile it manually using your preferred LaTeX editor like Overleaf, TeXShop, or MiKTeX.`
    }
  }
}

// Custom server compilation (for when we have our own LaTeX server)
export async function compileWithCustomServer(latexSource: string): Promise<LaTeXCompilationResult> {
  try {
    const response = await fetch('/api/latex/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: latexSource })
    })

    const result = await response.json()
    
    if (result.success) {
      return {
        success: true,
        pdfBuffer: Buffer.from(result.pdf, 'base64')
      }
    } else {
      return {
        success: false,
        error: result.error,
        logs: result.logs
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `Custom server compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Utility function to download LaTeX source
export function downloadLatexSource(templateId: string, resumeData: ResumeData): void {
  const template = getLatexTemplate(templateId)
  if (!template) {
    throw new Error('Template not found')
  }

  const latexSource = template.generateLaTeX(resumeData)
  const fileName = resumeData.personalInfo.name 
    ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.tex`
    : 'Resume.tex'

  const blob = new Blob([latexSource], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Utility function to escape LaTeX special characters
export function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\textasciitilde{}')
} 