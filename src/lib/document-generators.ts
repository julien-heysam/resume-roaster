import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell } from 'docx'
import { ResumeData } from './resume-templates'
import { generateDOCXFromHTML } from './html-to-docx'

// Enhanced PDF Generation using HTML to PDF conversion
export const generatePDF = async (resumeData: ResumeData, htmlContent?: string): Promise<Blob> => {
  // If we have styled HTML content, try to use server-side conversion
  if (htmlContent) {
    try {
      return await generatePDFFromHTML(htmlContent, resumeData.personalInfo.name)
    } catch (error) {
      console.warn('HTML to PDF conversion failed, falling back to basic PDF generation:', error)
      // Fall back to basic PDF generation
    }
  }

  // Fallback to basic PDF generation using jsPDF
  return generateBasicPDF(resumeData)
}

// Generate PDF from HTML content using server-side API (preserves styling)
const generatePDFFromHTML = async (htmlContent: string, fileName: string): Promise<Blob> => {
  const response = await fetch('/api/generate-pdf-from-html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      htmlContent,
      fileName: fileName.replace(/\s+/g, '_')
    })
  })

  if (!response.ok) {
    throw new Error(`PDF generation failed: ${response.statusText}`)
  }

  return await response.blob()
}

// Basic PDF Generation using jsPDF (fallback)
const generateBasicPDF = async (resumeData: ResumeData): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Set font
  pdf.setFont('helvetica')
  
  let yPosition = 20
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, isBold: boolean = false, align: 'left' | 'center' | 'right' = 'left') => {
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
    
    const lines = pdf.splitTextToSize(text, contentWidth)
    
    lines.forEach((line: string) => {
      if (yPosition > 280) { // Check if we need a new page
        pdf.addPage()
        yPosition = 20
      }
      
      let xPosition = margin
      if (align === 'center') {
        xPosition = pageWidth / 2
      } else if (align === 'right') {
        xPosition = pageWidth - margin
      }
      
      pdf.text(line, xPosition, yPosition, { align })
      yPosition += fontSize * 0.5
    })
    
    yPosition += 5 // Add some spacing after text
  }

  // Add header with better styling
  addText(resumeData.personalInfo.name, 24, true, 'center')
  
  // Contact information
  const contactInfo = [
    resumeData.personalInfo.email,
    resumeData.personalInfo.phone,
    resumeData.personalInfo.location
  ].filter(Boolean).join(' | ')
  addText(contactInfo, 11, false, 'center')
  
  // Links
  if (resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.portfolio) {
    const links = [
      resumeData.personalInfo.linkedin,
      resumeData.personalInfo.github,
      resumeData.personalInfo.portfolio
    ].filter(Boolean).join(' | ')
    addText(links, 10, false, 'center')
  }

  yPosition += 10

  // Add summary with better formatting
  if (resumeData.summary) {
    addText('PROFESSIONAL SUMMARY', 14, true)
    yPosition += 2
    addText(resumeData.summary, 11)
    yPosition += 8
  }

  // Add experience with improved formatting
  if (resumeData.experience.length > 0) {
    addText('PROFESSIONAL EXPERIENCE', 14, true)
    yPosition += 2
    
    resumeData.experience.forEach((job, index) => {
      if (index > 0) yPosition += 5
      
      addText(`${job.title} | ${job.company}`, 12, true)
      addText(`${job.startDate} - ${job.endDate} | ${job.location}`, 10, false)
      yPosition += 2
      
      job.description.forEach(desc => {
        addText(`• ${desc}`, 10)
      })
      
      job.achievements.forEach(achievement => {
        addText(`• ${achievement}`, 10)
      })
    })
    yPosition += 8
  }

  // Add education with better formatting
  if (resumeData.education.length > 0) {
    addText('EDUCATION', 14, true)
    yPosition += 2
    
    resumeData.education.forEach((edu, index) => {
      if (index > 0) yPosition += 3
      
      addText(edu.degree, 12, true)
      addText(`${edu.school}, ${edu.location} | ${edu.graduationDate}`, 10)
      
      if (edu.gpa) {
        addText(`GPA: ${edu.gpa}`, 10)
      }
      if (edu.honors && edu.honors.length > 0) {
        addText(`Honors: ${edu.honors.join(', ')}`, 10)
      }
    })
    yPosition += 8
  }

  // Add skills with better organization
  if (resumeData.skills) {
    addText('SKILLS', 14, true)
    yPosition += 2
    
    if (resumeData.skills.technical.length > 0) {
      addText(`Technical: ${resumeData.skills.technical.join(', ')}`, 10)
    }
    if (resumeData.skills.soft.length > 0) {
      addText(`Soft Skills: ${resumeData.skills.soft.join(', ')}`, 10)
    }
    if (resumeData.skills.languages && resumeData.skills.languages.length > 0) {
      addText(`Languages: ${resumeData.skills.languages.join(', ')}`, 10)
    }
    if (resumeData.skills.certifications && resumeData.skills.certifications.length > 0) {
      addText(`Certifications: ${resumeData.skills.certifications.join(', ')}`, 10)
    }
    yPosition += 8
  }

  // Add projects if available
  if (resumeData.projects && resumeData.projects.length > 0) {
    addText('PROJECTS', 14, true)
    yPosition += 2
    
    resumeData.projects.forEach((project, index) => {
      if (index > 0) yPosition += 3
      
      addText(project.name, 12, true)
      addText(project.description, 10)
      addText(`Technologies: ${project.technologies.join(', ')}`, 10)
      if (project.link) {
        addText(`Link: ${project.link}`, 10)
      }
    })
  }

  return new Blob([pdf.output('blob')], { type: 'application/pdf' })
}

// Enhanced DOCX Generation with better styling
export const generateDOCX = async (resumeData: ResumeData, htmlContent?: string): Promise<Blob> => {
  // If we have styled HTML content, try to use HTML to DOCX conversion
  if (htmlContent) {
    try {
      return await generateDOCXFromHTML(htmlContent, resumeData.personalInfo.name)
    } catch (error) {
      console.warn('HTML to DOCX conversion failed, falling back to basic DOCX generation:', error)
      // Fall back to basic DOCX generation
    }
  }

  // Fallback to enhanced basic DOCX generation
  return generateEnhancedDOCX(resumeData)
}

// Enhanced DOCX generation with better styling and formatting
const generateEnhancedDOCX = async (resumeData: ResumeData): Promise<Blob> => {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720,    // 0.5 inch
            right: 720,  // 0.5 inch
            bottom: 720, // 0.5 inch
            left: 720,   // 0.5 inch
          },
        },
      },
      children: [
        // Header - Name with better styling
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.personalInfo.name,
              bold: true,
              size: 36, // 18pt
              font: 'Times New Roman',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 }, // 12pt spacing
        }),

        // Contact Information with better formatting
        new Paragraph({
          children: [
            new TextRun({
              text: `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`,
              size: 22, // 11pt
              font: 'Times New Roman',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }, // 6pt spacing
        }),

        // Links with better styling
        ...(resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.portfolio ? [
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  resumeData.personalInfo.linkedin,
                  resumeData.personalInfo.github,
                  resumeData.personalInfo.portfolio
                ].filter(Boolean).join(' | '),
                size: 20, // 10pt
                font: 'Times New Roman',
                color: '0066CC',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 }, // 18pt spacing
          })
        ] : []),

        // Professional Summary with enhanced styling
        ...(resumeData.summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 28, // 14pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 240, after: 120 },
            border: {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.summary,
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 360 },
            alignment: AlignmentType.JUSTIFIED,
          }),
        ] : []),

        // Professional Experience with enhanced formatting
        ...(resumeData.experience.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 28, // 14pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 240, after: 120 },
            border: {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          ...resumeData.experience.flatMap((job, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${job.title} | ${job.company}`,
                  bold: true,
                  size: 24, // 12pt
                  font: 'Times New Roman',
                }),
              ],
              spacing: { before: index > 0 ? 240 : 120, after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${job.startDate} - ${job.endDate} | ${job.location}`,
                  size: 22, // 11pt
                  italics: true,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 120 },
            }),
            ...job.description.map(desc => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${desc}`,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 60 },
                indent: { left: 360 }, // 0.25 inch indent
              })
            ),
            ...job.achievements.map(achievement => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 60 },
                indent: { left: 360 }, // 0.25 inch indent
              })
            ),
          ])
        ] : []),

        // Education with enhanced styling
        ...(resumeData.education.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 28, // 14pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 360, after: 120 },
            border: {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          ...resumeData.education.flatMap((edu, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 24, // 12pt
                  font: 'Times New Roman',
                }),
              ],
              spacing: { before: index > 0 ? 240 : 120, after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.school}, ${edu.location} | ${edu.graduationDate}`,
                  size: 22, // 11pt
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 60 },
            }),
            ...(edu.gpa ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `GPA: ${edu.gpa}`,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 60 },
              })
            ] : []),
            ...(edu.honors && edu.honors.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Honors: ${edu.honors.join(', ')}`,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 120 },
              })
            ] : []),
          ])
        ] : []),

        // Skills with better organization
        new Paragraph({
          children: [
            new TextRun({
              text: 'SKILLS',
              bold: true,
              size: 28, // 14pt
              font: 'Times New Roman',
            }),
          ],
          spacing: { before: 360, after: 120 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
        ...(resumeData.skills.technical.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Technical: ',
                bold: true,
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
              new TextRun({
                text: resumeData.skills.technical.join(', '),
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 60 },
          })
        ] : []),
        ...(resumeData.skills.soft.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Soft Skills: ',
                bold: true,
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
              new TextRun({
                text: resumeData.skills.soft.join(', '),
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 60 },
          })
        ] : []),
        ...(resumeData.skills.languages && resumeData.skills.languages.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Languages: ',
                bold: true,
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
              new TextRun({
                text: resumeData.skills.languages.join(', '),
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 60 },
          })
        ] : []),
        ...(resumeData.skills.certifications && resumeData.skills.certifications.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Certifications: ',
                bold: true,
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
              new TextRun({
                text: resumeData.skills.certifications.join(', '),
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 120 },
          })
        ] : []),

        // Projects with enhanced styling
        ...(resumeData.projects && resumeData.projects.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROJECTS',
                bold: true,
                size: 28, // 14pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 360, after: 120 },
            border: {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          ...resumeData.projects.flatMap((project, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: project.name,
                  bold: true,
                  size: 24, // 12pt
                  font: 'Times New Roman',
                }),
              ],
              spacing: { before: index > 0 ? 240 : 120, after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 22, // 11pt
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: ${project.technologies.join(', ')}`,
                  size: 22, // 11pt
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 60 },
            }),
            ...(project.link ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Link: ${project.link}`,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                    color: '0066CC',
                  }),
                ],
                spacing: { after: 120 },
              })
            ] : []),
          ])
        ] : []),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  })
}

// Helper function to download a blob as a file
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
} 