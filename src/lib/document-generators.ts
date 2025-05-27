import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell } from 'docx'
import { ResumeData } from './resume-templates'

// PDF Generation using jsPDF
export const generatePDF = async (resumeData: ResumeData, htmlContent?: string): Promise<Blob> => {
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

  // Add header
  addText(resumeData.personalInfo.name, 20, true, 'center')
  addText(`${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`, 10, false, 'center')
  
  if (resumeData.personalInfo.linkedin || resumeData.personalInfo.github) {
    const links = [
      resumeData.personalInfo.linkedin,
      resumeData.personalInfo.github,
      resumeData.personalInfo.portfolio
    ].filter(Boolean).join(' | ')
    addText(links, 10, false, 'center')
  }

  yPosition += 10

  // Add summary
  if (resumeData.summary) {
    addText('PROFESSIONAL SUMMARY', 14, true)
    addText(resumeData.summary, 10)
    yPosition += 5
  }

  // Add experience
  if (resumeData.experience.length > 0) {
    addText('PROFESSIONAL EXPERIENCE', 14, true)
    
    resumeData.experience.forEach(job => {
      addText(`${job.title} | ${job.company}`, 12, true)
      addText(`${job.startDate} - ${job.endDate} | ${job.location}`, 10)
      
      job.description.forEach(desc => {
        addText(`• ${desc}`, 10)
      })
      
      job.achievements.forEach(achievement => {
        addText(`• ${achievement}`, 10)
      })
      
      yPosition += 5
    })
  }

  // Add education
  if (resumeData.education.length > 0) {
    addText('EDUCATION', 14, true)
    
    resumeData.education.forEach(edu => {
      addText(`${edu.degree}`, 12, true)
      addText(`${edu.school}, ${edu.location} | ${edu.graduationDate}`, 10)
      if (edu.gpa) {
        addText(`GPA: ${edu.gpa}`, 10)
      }
      if (edu.honors && edu.honors.length > 0) {
        addText(`Honors: ${edu.honors.join(', ')}`, 10)
      }
      yPosition += 5
    })
  }

  // Add skills
  if (resumeData.skills) {
    addText('SKILLS', 14, true)
    
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
  }

  // Add projects if available
  if (resumeData.projects && resumeData.projects.length > 0) {
    addText('PROJECTS', 14, true)
    
    resumeData.projects.forEach(project => {
      addText(project.name, 12, true)
      addText(project.description, 10)
      addText(`Technologies: ${project.technologies.join(', ')}`, 10)
      if (project.link) {
        addText(`Link: ${project.link}`, 10)
      }
      yPosition += 5
    })
  }

  return new Blob([pdf.output('blob')], { type: 'application/pdf' })
}

// DOC/DOCX Generation using docx
export const generateDOCX = async (resumeData: ResumeData): Promise<Blob> => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header - Name
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.personalInfo.name,
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),

        // Contact Information
        new Paragraph({
          children: [
            new TextRun({
              text: `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`,
              size: 20,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),

        // Links
        ...(resumeData.personalInfo.linkedin || resumeData.personalInfo.github ? [
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  resumeData.personalInfo.linkedin,
                  resumeData.personalInfo.github,
                  resumeData.personalInfo.portfolio
                ].filter(Boolean).join(' | '),
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        ] : []),

        // Professional Summary
        ...(resumeData.summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.summary,
                size: 20,
              }),
            ],
            spacing: { after: 300 },
          }),
        ] : []),

        // Professional Experience
        ...(resumeData.experience.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          ...resumeData.experience.flatMap(job => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${job.title} | ${job.company}`,
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { before: 100, after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${job.startDate} - ${job.endDate} | ${job.location}`,
                  size: 20,
                  italics: true,
                }),
              ],
              spacing: { after: 100 },
            }),
            ...job.description.map(desc => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${desc}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 50 },
              })
            ),
            ...job.achievements.map(achievement => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 50 },
              })
            ),
          ])
        ] : []),

        // Education
        ...(resumeData.education.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 300, after: 100 },
          }),
          ...resumeData.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { before: 100, after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.school}, ${edu.location} | ${edu.graduationDate}`,
                  size: 20,
                }),
              ],
              spacing: { after: 50 },
            }),
            ...(edu.gpa ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `GPA: ${edu.gpa}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 50 },
              })
            ] : []),
            ...(edu.honors && edu.honors.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Honors: ${edu.honors.join(', ')}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              })
            ] : []),
          ])
        ] : []),

        // Skills
        new Paragraph({
          children: [
            new TextRun({
              text: 'SKILLS',
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 300, after: 100 },
        }),
        ...(resumeData.skills.technical.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: `Technical: ${resumeData.skills.technical.join(', ')}`,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        ] : []),
        ...(resumeData.skills.soft.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: `Soft Skills: ${resumeData.skills.soft.join(', ')}`,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        ] : []),
        ...(resumeData.skills.languages && resumeData.skills.languages.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: `Languages: ${resumeData.skills.languages.join(', ')}`,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        ] : []),
        ...(resumeData.skills.certifications && resumeData.skills.certifications.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: `Certifications: ${resumeData.skills.certifications.join(', ')}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        ] : []),

        // Projects
        ...(resumeData.projects && resumeData.projects.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROJECTS',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 300, after: 100 },
          }),
          ...resumeData.projects.flatMap(project => [
            new Paragraph({
              children: [
                new TextRun({
                  text: project.name,
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { before: 100, after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 20,
                }),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: ${project.technologies.join(', ')}`,
                  size: 20,
                }),
              ],
              spacing: { after: 50 },
            }),
            ...(project.link ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Link: ${project.link}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
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