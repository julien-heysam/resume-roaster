import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx'

interface ParsedElement {
  type: 'paragraph' | 'heading' | 'list-item'
  text: string
  styles: {
    bold?: boolean
    italic?: boolean
    fontSize?: number
    alignment?: typeof AlignmentType[keyof typeof AlignmentType]
  }
  level?: number
}

export const generateDOCXFromHTML = async (htmlContent: string, fileName: string): Promise<Blob> => {
  // Parse HTML content to extract text and basic styling
  const elements = parseHTMLContent(htmlContent)
  
  // Convert parsed elements to DOCX paragraphs
  const paragraphs = elements.map(element => {
    const textRun = new TextRun({
      text: element.text,
      bold: element.styles.bold || false,
      italics: element.styles.italic || false,
      size: element.styles.fontSize || 22, // 11pt default
      font: 'Times New Roman',
    })

    return new Paragraph({
      children: [textRun],
      alignment: element.styles.alignment || AlignmentType.LEFT,
      spacing: { 
        after: element.type === 'heading' ? 240 : 120,
        before: element.type === 'heading' ? 240 : 0
      },
      ...(element.type === 'heading' && {
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    })
  })

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
      children: paragraphs,
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  })
}

const parseHTMLContent = (htmlContent: string): ParsedElement[] => {
  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  
  const elements: ParsedElement[] = []
  
  // Extract content from the body
  const body = doc.body
  if (!body) return elements

  // Recursively parse elements
  const parseElement = (element: Element) => {
    const tagName = element.tagName.toLowerCase()
    
    // Handle different HTML elements
    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        elements.push({
          type: 'heading',
          text: element.textContent?.trim() || '',
          styles: {
            bold: true,
            fontSize: getHeadingSize(tagName),
            alignment: getAlignment(element)
          },
          level: parseInt(tagName.charAt(1))
        })
        break
        
      case 'p':
        const text = element.textContent?.trim()
        if (text) {
          elements.push({
            type: 'paragraph',
            text,
            styles: {
              bold: hasStyle(element, 'font-weight', 'bold') || hasClass(element, 'name'),
              italic: hasStyle(element, 'font-style', 'italic'),
              fontSize: getFontSize(element),
              alignment: getAlignment(element)
            }
          })
        }
        break
        
      case 'li':
        const listText = element.textContent?.trim()
        if (listText) {
          elements.push({
            type: 'list-item',
            text: `• ${listText}`,
            styles: {
              fontSize: 22 // 11pt
            }
          })
        }
        break
        
      case 'div':
        // Handle div elements that might contain text
        if (element.children.length === 0) {
          const divText = element.textContent?.trim()
          if (divText) {
            elements.push({
              type: 'paragraph',
              text: divText,
              styles: {
                bold: hasStyle(element, 'font-weight', 'bold') || hasClass(element, 'name'),
                italic: hasStyle(element, 'font-style', 'italic'),
                fontSize: getFontSize(element),
                alignment: getAlignment(element)
              }
            })
          }
        } else {
          // Recursively parse child elements
          Array.from(element.children).forEach(parseElement)
        }
        break
        
      default:
        // For other elements, recursively parse children
        Array.from(element.children).forEach(parseElement)
        break
    }
  }
  
  Array.from(body.children).forEach(parseElement)
  
  return elements.filter(el => el.text.length > 0)
}

const getHeadingSize = (tagName: string): number => {
  const sizes = {
    'h1': 32, // 16pt
    'h2': 28, // 14pt
    'h3': 26, // 13pt
    'h4': 24, // 12pt
    'h5': 22, // 11pt
    'h6': 20  // 10pt
  }
  return sizes[tagName as keyof typeof sizes] || 24
}

const getFontSize = (element: Element): number => {
  const style = window.getComputedStyle ? window.getComputedStyle(element) : null
  if (style) {
    const fontSize = style.fontSize
    if (fontSize.includes('pt')) {
      return parseInt(fontSize) * 2 // Convert pt to half-points for DOCX
    }
    if (fontSize.includes('px')) {
      return Math.round(parseInt(fontSize) * 1.5) // Rough conversion from px to half-points
    }
  }
  
  // Check for specific classes that indicate font sizes
  if (hasClass(element, 'name')) return 36 // 18pt
  if (hasClass(element, 'section-title')) return 28 // 14pt
  if (hasClass(element, 'job-title')) return 24 // 12pt
  
  return 22 // 11pt default
}

const getAlignment = (element: Element): typeof AlignmentType[keyof typeof AlignmentType] => {
  const style = window.getComputedStyle ? window.getComputedStyle(element) : null
  if (style) {
    const textAlign = style.textAlign
    switch (textAlign) {
      case 'center': return AlignmentType.CENTER
      case 'right': return AlignmentType.RIGHT
      case 'justify': return AlignmentType.JUSTIFIED
      default: return AlignmentType.LEFT
    }
  }
  
  // Check for specific classes
  if (hasClass(element, 'header') || hasClass(element, 'name')) {
    return AlignmentType.CENTER
  }
  
  return AlignmentType.LEFT
}

const hasStyle = (element: Element, property: string, value: string): boolean => {
  const style = window.getComputedStyle ? window.getComputedStyle(element) : null
  if (style) {
    return style.getPropertyValue(property).includes(value)
  }
  return false
}

const hasClass = (element: Element, className: string): boolean => {
  return element.classList.contains(className)
} 