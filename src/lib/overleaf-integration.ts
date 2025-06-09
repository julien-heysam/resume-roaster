"use client"

import { ResumeData } from './resume-templates'
// LaTeX templates removed - using HTML/CSS templates only

export interface OverleafIntegrationResult {
  success: boolean
  overleafUrl?: string
  error?: string
}

/**
 * Opens LaTeX code in Overleaf using their API
 * Based on: https://www.overleaf.com/devs
 */
export function openInOverleaf(latexCode: string, filename: string = 'resume.tex'): void {
  try {
    // Create a form element to submit to Overleaf
    const form = document.createElement('form')
    form.action = 'https://www.overleaf.com/docs'
    form.method = 'post'
    form.target = '_blank'
    form.style.display = 'none'

    // Add the LaTeX code as a raw snippet
    const snippetInput = document.createElement('input')
    snippetInput.type = 'hidden'
    snippetInput.name = 'snip'
    snippetInput.value = latexCode
    form.appendChild(snippetInput)

    // Set the engine to pdflatex for better compatibility
    const engineInput = document.createElement('input')
    engineInput.type = 'hidden'
    engineInput.name = 'engine'
    engineInput.value = 'pdflatex'
    form.appendChild(engineInput)

    // Set the main document name
    const mainDocInput = document.createElement('input')
    mainDocInput.type = 'hidden'
    mainDocInput.name = 'main_document'
    mainDocInput.value = filename
    form.appendChild(mainDocInput)

    // Add the form to the document and submit it
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)

  } catch (error) {
    console.error('Error opening in Overleaf:', error)
    throw new Error('Failed to open in Overleaf. Please try copying the LaTeX code manually.')
  }
}

/**
 * Creates an Overleaf URL for LaTeX code using URL encoding
 * This creates a shareable link that opens the code in Overleaf
 */
export function createOverleafUrl(latexCode: string, filename: string = 'resume.tex'): string {
  try {
    // Encode the LaTeX code for URL
    const encodedSnippet = encodeURIComponent(latexCode)
    
    // Create the Overleaf URL with parameters
    const baseUrl = 'https://www.overleaf.com/docs'
    const params = new URLSearchParams({
      'encoded_snip': encodedSnippet,
      'engine': 'pdflatex',
      'main_document': filename
    })
    
    return `${baseUrl}?${params.toString()}`
  } catch (error) {
    console.error('Error creating Overleaf URL:', error)
    throw new Error('Failed to create Overleaf URL')
  }
}

/**
 * Opens LaTeX code in Overleaf using Base64 encoding
 * This method is more reliable for complex LaTeX documents
 */
export function openInOverleafBase64(latexCode: string, filename: string = 'resume.tex'): void {
  try {
    // Convert LaTeX code to Base64
    const base64Code = btoa(unescape(encodeURIComponent(latexCode)))
    const dataUri = `data:application/x-tex;base64,${base64Code}`

    // Create a form element to submit to Overleaf
    const form = document.createElement('form')
    form.action = 'https://www.overleaf.com/docs'
    form.method = 'post'
    form.target = '_blank'
    form.style.display = 'none'

    // Add the Base64 encoded LaTeX code
    const snippetInput = document.createElement('input')
    snippetInput.type = 'hidden'
    snippetInput.name = 'snip_uri'
    snippetInput.value = dataUri
    form.appendChild(snippetInput)

    // Set the engine to pdflatex
    const engineInput = document.createElement('input')
    engineInput.type = 'hidden'
    engineInput.name = 'engine'
    engineInput.value = 'pdflatex'
    form.appendChild(engineInput)

    // Set the main document name
    const mainDocInput = document.createElement('input')
    mainDocInput.type = 'hidden'
    mainDocInput.name = 'main_document'
    mainDocInput.value = filename
    form.appendChild(mainDocInput)

    // Add the form to the document and submit it
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)

  } catch (error) {
    console.error('Error opening in Overleaf with Base64:', error)
    throw new Error('Failed to open in Overleaf. Please try copying the LaTeX code manually.')
  }
}

/**
 * Generate HTML from template and open directly in Overleaf (deprecated - use HTML templates instead)
 */
export function openResumeInOverleaf(
  templateId: string, 
  resumeData: ResumeData,
  filename: string = 'optimized_resume.tex'
): OverleafIntegrationResult {
  return {
    success: false,
    error: 'LaTeX templates have been replaced with HTML/CSS templates. Please use the HTML resume generator instead.'
  }
}

/**
 * Download LaTeX source file (keeping this for users who prefer local compilation)
 */
export function downloadLatexSource(latexCode: string, filename: string = 'resume.tex'): void {
  try {
    const blob = new Blob([latexCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading LaTeX source:', error)
    throw error
  }
}

/**
 * Create a shareable Overleaf link that can be copied
 */
export function getShareableOverleafLink(latexCode: string, filename: string = 'resume.tex'): string {
  return createOverleafUrl(latexCode, filename)
}

/**
 * Utility function to check if we're in a browser environment
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined'
} 