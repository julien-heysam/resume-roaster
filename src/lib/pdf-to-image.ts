import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function convertPDFToImages(pdfBuffer: Buffer): Promise<string[]> {
  try {
    console.log('Converting PDF to images using system tools...')
    
    // Create temporary directory for processing
    const tempDir = os.tmpdir()
    const tempPdfPath = path.join(tempDir, `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`)
    const tempOutputDir = path.join(tempDir, `pdf_images_${Date.now()}_${Math.random().toString(36).substring(7)}`)
    
    try {
      // Write PDF buffer to temporary file
      await fs.writeFile(tempPdfPath, pdfBuffer)
      
      // Create output directory
      await fs.mkdir(tempOutputDir, { recursive: true })
      
      // Try to use ImageMagick convert command (if available)
      try {
        const outputPattern = path.join(tempOutputDir, 'page-%d.png')
        await execAsync(`convert -density 150 "${tempPdfPath}[0-2]" "${outputPattern}"`)
        
        // Read generated images
        const images: string[] = []
        const files = await fs.readdir(tempOutputDir)
        const imageFiles = files.filter(f => f.endsWith('.png')).sort()
        
        for (const file of imageFiles.slice(0, 3)) { // Limit to 3 pages
          const imagePath = path.join(tempOutputDir, file)
          const imageBuffer = await fs.readFile(imagePath)
          const base64Data = imageBuffer.toString('base64')
          images.push(base64Data)
          console.log(`✅ Converted page to image (${Math.round(base64Data.length / 1024)}KB)`)
        }
        
        console.log(`🎉 Successfully converted ${images.length} pages to images`)
        return images
        
      } catch (convertError) {
        console.log('ImageMagick not available, trying alternative method...')
        
        // Fallback: Try using poppler-utils (if available)
        try {
          await execAsync(`pdftoppm -png -f 1 -l 3 -scale-to 1024 "${tempPdfPath}" "${path.join(tempOutputDir, 'page')}"`)
          
          // Read generated images
          const images: string[] = []
          const files = await fs.readdir(tempOutputDir)
          const imageFiles = files.filter(f => f.endsWith('.png')).sort()
          
          for (const file of imageFiles.slice(0, 3)) { // Limit to 3 pages
            const imagePath = path.join(tempOutputDir, file)
            const imageBuffer = await fs.readFile(imagePath)
            const base64Data = imageBuffer.toString('base64')
            images.push(base64Data)
            console.log(`✅ Converted page to image (${Math.round(base64Data.length / 1024)}KB)`)
          }
          
          console.log(`🎉 Successfully converted ${images.length} pages to images using poppler`)
          return images
          
        } catch (popplerError) {
          console.log('Poppler-utils not available either. PDF image conversion disabled.')
          return []
        }
      }
      
    } finally {
      // Clean up temporary files
      try {
        await fs.unlink(tempPdfPath)
        const files = await fs.readdir(tempOutputDir)
        for (const file of files) {
          await fs.unlink(path.join(tempOutputDir, file))
        }
        await fs.rmdir(tempOutputDir)
      } catch (cleanupError) {
        console.warn('Failed to clean up temporary files:', cleanupError)
      }
    }
    
  } catch (error) {
    console.error('❌ Error converting PDF to images:', error)
    console.log('Continuing without images...')
    return []
  }
} 