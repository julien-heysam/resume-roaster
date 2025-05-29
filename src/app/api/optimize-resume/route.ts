import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { getOrCreateJobSummary, shouldSummarizeJobDescription } from '@/lib/job-summary-utils'
import crypto from 'crypto'

// Configure runtime for long-running operations
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes timeout
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const startTime = Date.now()
    
    const { 
      extractedResumeId,
      jobDescription, 
      analysisData,
      templateId = 'modern-professional',
      documentId, 
      analysisId
    } = await request.json()

    console.log('=== OPTIMIZE RESUME DEBUG ===')
    console.log('Extracted Resume ID:', extractedResumeId)
    console.log('Job description length:', jobDescription?.length || 0)
    console.log('Has analysis data:', !!analysisData)
    console.log('Template ID:', templateId)
    console.log('Document ID:', documentId)
    console.log('Analysis ID:', analysisId)

    if (!extractedResumeId) {
      return NextResponse.json(
        { error: 'Extracted resume ID is required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the extracted resume data
    const extractedResume = await db.extractedResume.findUnique({
      where: { id: extractedResumeId },
      include: {
        user: true,
        document: true,
        analysis: true
      }
    })

    if (!extractedResume) {
      return NextResponse.json(
        { error: 'Extracted resume not found' },
        { status: 404 }
      )
    }

    // Parse the extracted resume data
    let baseResumeData
    try {
      baseResumeData = JSON.parse(extractedResume.extractedData)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid extracted resume data' },
        { status: 400 }
      )
    }

    // Get or create job description summary if provided and long
    let jobSummaryData = null
    let effectiveJobDescription = jobDescription || ''

    if (jobDescription && shouldSummarizeJobDescription(jobDescription, 3000)) {
      console.log('Job description is long, getting/creating summary...')
      
      try {
        jobSummaryData = await getOrCreateJobSummary(jobDescription)
        effectiveJobDescription = jobSummaryData.summary
        console.log('Using job summary:', jobSummaryData.cached ? 'cached' : 'newly generated')
        console.log('Summary length:', effectiveJobDescription.length)
      } catch (error) {
        console.error('Error getting job summary:', error)
        effectiveJobDescription = jobDescription.substring(0, 3000) + '\n\n[Job description truncated for length...]'
      }
    }

    console.log('Effective job description length:', effectiveJobDescription.length)

    // Create content hash for deduplication (based on extracted resume + job + template)
    const contentHash = crypto
      .createHash('sha256')
      .update(`${extractedResumeId}-${effectiveJobDescription}-${templateId}`)
      .digest('hex')

    // Check for cached optimized resume first
    const cachedOptimizedResume = await db.optimizedResume.findUnique({
      where: { contentHash },
      include: {
        user: true,
        extractedResume: true,
        analysis: true,
        document: true,
        jobSummary: true
      }
    })

    if (cachedOptimizedResume) {
      console.log('Returning cached optimized resume')
      
      // Update usage count and last used
      await db.optimizedResume.update({
        where: { id: cachedOptimizedResume.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: JSON.parse(cachedOptimizedResume.extractedData),
        content: cachedOptimizedResume.content,
        cached: true,
        usageCount: cachedOptimizedResume.usageCount + 1,
        optimizedResumeId: cachedOptimizedResume.id,
        metadata: {
          processingTime: Date.now() - startTime,
          fromCache: true,
          atsScore: cachedOptimizedResume.atsScore,
          keywordsMatched: cachedOptimizedResume.keywordsMatched,
          optimizationSuggestions: cachedOptimizedResume.optimizationSuggestions
        }
      })
    }

    console.log('No cached optimized resume found, generating new one...')

    // Create the optimization prompt
    const prompt = `Optimize the following resume data for the target job description and analysis insights.

IMPORTANT:
- Keep it short and concise, this is a resume, not a novel.
- Keep it to 1000 words or less.

${effectiveJobDescription ? `
TARGET JOB DESCRIPTION:
${effectiveJobDescription}
` : ''}

BASE RESUME DATA (JSON):
${JSON.stringify(baseResumeData, null, 2)}

${analysisData ? `
ANALYSIS INSIGHTS:
- Overall Score: ${analysisData.overallScore}%
- Key Strengths: ${analysisData.strengths?.slice(0, 3).join(', ')}
- Areas for Improvement: ${analysisData.weaknesses?.slice(0, 3).join(', ')}
- Matched Keywords: ${analysisData.keywordMatch?.matched?.slice(0, 5).join(', ')}
- Missing Keywords: ${analysisData.keywordMatch?.missing?.slice(0, 5).join(', ')}
` : ''}

${jobSummaryData ? `
EXTRACTED JOB DETAILS:
- Company: ${jobSummaryData.companyName || 'Not specified'}
- Position: ${jobSummaryData.jobTitle || 'Not specified'}
- Location: ${jobSummaryData.location || 'Not specified'}
- Key Requirements: ${jobSummaryData.keyRequirements?.slice(0, 5).join(', ') || 'See job description'}
` : ''}

Please optimize and return ONLY a valid JSON object with the same structure as the base resume data, but with the following optimizations:

1. **Keyword Integration**: Naturally incorporate missing keywords from the job description
2. **Achievement Enhancement**: Quantify achievements where possible and align with job requirements
3. **Skills Optimization**: Prioritize and highlight relevant technical and soft skills
4. **Experience Tailoring**: Emphasize relevant experience and responsibilities
5. **Summary Enhancement**: Create a compelling summary that matches the job requirements
6. **ATS Optimization**: Ensure content is ATS-friendly with proper formatting and keywords

IMPORTANT INSTRUCTIONS:
1. Maintain the exact same JSON structure as the input
2. Keep all original information but enhance and optimize it
3. Add quantified metrics where logical and impactful
4. Ensure all dates remain in MM/YYYY format
5. Return ONLY the JSON object, no additional text or formatting
6. Make the content more compelling while staying truthful to the original data
7. Prioritize keywords and skills that match the job description

Return the optimized resume data in the same JSON format:`

    console.log('Final prompt length:', prompt.length)
    console.log('Estimated tokens (rough):', Math.ceil(prompt.length / 4))
    console.log('=== END DEBUG ===')

    console.log('🚀 Starting OpenAI API call...')
    const apiStartTime = Date.now()

    // Call OpenAI API with timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 240000) // 4 minutes timeout

    let openaiResponse
    try {
      openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          max_tokens: 40000,
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume optimizer and career coach. Optimize resume data for ATS systems and job requirements while maintaining truthfulness. Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. Do not wrap the JSON in ```json``` blocks.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
        }),
        signal: controller.signal
      })
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        console.error('OpenAI API call timed out after 4 minutes')
        return NextResponse.json(
          { error: 'Request timed out. Please try again with a shorter job description or resume.' },
          { status: 408 }
        )
      }
      console.error('OpenAI API call failed:', error)
      return NextResponse.json(
        { error: 'Failed to connect to AI service' },
        { status: 500 }
      )
    }

    clearTimeout(timeoutId)
    const apiCallTime = Date.now() - apiStartTime
    console.log(`✅ OpenAI API call completed in ${apiCallTime}ms`)

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({ error: 'Unknown error' }))
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to optimize resume data' },
        { status: 500 }
      )
    }

    console.log('📝 Parsing OpenAI response...')
    const openaiData = await openaiResponse.json()
    const optimizedContent = openaiData.choices[0]?.message?.content

    if (!optimizedContent) {
      return NextResponse.json(
        { error: 'No optimized data generated' },
        { status: 500 }
      )
    }

    console.log('🔍 Parsing JSON content...')
    // Parse the JSON response with retry mechanism
    let optimizedData
    let finalContent = optimizedContent
    let totalTokensUsed = (openaiData.usage?.prompt_tokens || 0) + (openaiData.usage?.completion_tokens || 0)
    let totalCost = ((openaiData.usage?.prompt_tokens || 0) * 0.00015 + (openaiData.usage?.completion_tokens || 0) * 0.0006) / 1000

    // Helper function to detect if content looks incomplete
    const isContentIncomplete = (content: string) => {
      // Check if content ends abruptly without proper JSON closure
      const trimmed = content.trim()
      
      // Check for common signs of incomplete JSON
      if (trimmed.endsWith(',') || trimmed.endsWith(':')) {
        return true
      }
      
      // Check brace/bracket balance
      const openBraces = (content.match(/{/g) || []).length
      const closeBraces = (content.match(/}/g) || []).length
      const openBrackets = (content.match(/\[/g) || []).length
      const closeBrackets = (content.match(/\]/g) || []).length
      
      if (openBraces > closeBraces || openBrackets > closeBrackets) {
        console.log('⚠️ Content appears incomplete - unmatched braces/brackets')
        return true
      }
      
      return false
    }

    // Helper function to try parsing JSON with multiple methods
    const tryParseJSON = (content: string) => {
      console.log('🔍 Attempting to parse JSON content...')
      console.log('Content preview:', content.substring(0, 200) + '...')
      console.log('Content length:', content.length)
      
      // Method 1: Extract text between ```json ... ``` (most reliable for markdown)
      try {
        console.log('Trying Method 1: JSON code block extraction...')
        // More flexible regex to handle various markdown formats
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim()
          console.log('Extracted JSON preview:', extractedJson.substring(0, 200) + '...')
          console.log('Extracted JSON length:', extractedJson.length)
          return JSON.parse(extractedJson)
        }
        throw new Error('No JSON code block found')
      } catch (extractError: any) {
        console.log('Method 1 failed:', extractError.message)
      }

      // Method 2: Try parsing as direct JSON (after cleaning markdown)
      try {
        console.log('Trying Method 2: Direct JSON parsing after cleaning...')
        // Remove common markdown artifacts
        let cleanContent = content
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()
        
        console.log('Cleaned content preview:', cleanContent.substring(0, 200) + '...')
        console.log('Cleaned content length:', cleanContent.length)
        return JSON.parse(cleanContent)
      } catch (parseError: any) {
        console.log('Method 2 failed:', parseError.message)
      }

      // // Method 3: Find first { and last } and extract JSON (with validation)
      // try {
      //   console.log('Trying Method 3: Brace extraction with validation...')
      //   const firstBrace = content.indexOf('{')
      //   const lastBrace = content.lastIndexOf('}')
        
      //   if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      //     const jsonText = content.substring(firstBrace, lastBrace + 1)
      //     console.log('Extracted JSON by braces preview:', jsonText.substring(0, 200) + '...')
      //     console.log('Extracted JSON by braces length:', jsonText.length)
          
      //     // Basic validation: check if it looks like complete JSON
      //     const openBraces = (jsonText.match(/{/g) || []).length
      //     const closeBraces = (jsonText.match(/}/g) || []).length
      //     const openBrackets = (jsonText.match(/\[/g) || []).length
      //     const closeBrackets = (jsonText.match(/\]/g) || []).length
          
      //     console.log('Brace validation:', { openBraces, closeBraces, openBrackets, closeBrackets })
          
      //     if (openBraces !== closeBraces) {
      //       throw new Error(`Mismatched braces: ${openBraces} open, ${closeBraces} close`)
      //     }
      //     if (openBrackets !== closeBrackets) {
      //       throw new Error(`Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`)
      //     }
          
      //     return JSON.parse(jsonText)
      //   }
      //   throw new Error('No valid JSON braces found')
      // } catch (braceError: any) {
      //   console.log('Method 3 failed:', braceError.message)
      // }

      // Method 4: Try to find JSON after any text (line-by-line)
      try {
        console.log('Trying Method 4: JSON after text...')
        const lines = content.split('\n')
        let jsonStart = -1
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('{')) {
            jsonStart = i
            break
          }
        }
        
        if (jsonStart !== -1) {
          const jsonLines = lines.slice(jsonStart)
          const jsonText = jsonLines.join('\n').trim()
          console.log('Found JSON starting at line', jsonStart)
          console.log('Line-based JSON preview:', jsonText.substring(0, 200) + '...')
          
          // Try to find a complete JSON object
          let braceCount = 0
          let endIndex = -1
          
          for (let i = 0; i < jsonText.length; i++) {
            if (jsonText[i] === '{') braceCount++
            if (jsonText[i] === '}') braceCount--
            if (braceCount === 0 && jsonText[i] === '}') {
              endIndex = i + 1
              break
            }
          }
          
          if (endIndex > 0) {
            const completeJson = jsonText.substring(0, endIndex)
            console.log('Found complete JSON object, length:', completeJson.length)
            return JSON.parse(completeJson)
          }
          
          return JSON.parse(jsonText)
        }
        throw new Error('No JSON found after text')
      } catch (lineError: any) {
        console.log('Method 4 failed:', lineError.message)
      }

      console.log('❌ All JSON parsing methods failed, returning null for continuation handling')
      return null
    }

    // First attempt at parsing
    console.log('🎯 Checking if content appears complete...')
    const contentIncomplete = isContentIncomplete(finalContent)
    let firstParseError: any = null
    
    if (contentIncomplete) {
      console.log('⚠️ Content appears incomplete, skipping initial parse and going directly to continuation...')
    } else {
      try {
        const parseResult = tryParseJSON(finalContent)
        if (parseResult) {
          optimizedData = parseResult
          console.log('✅ JSON parsing successful on first attempt')
        } else {
          console.log('❌ JSON parsing returned null, will attempt continuation...')
        }
      } catch (error: any) {
        firstParseError = error
        console.log('❌ First JSON parsing failed:', error.message)
        console.log('Will attempt continuation...')
      }
    }

    // If we don't have parsed data yet, attempt continuation
    if (!optimizedData) {
      console.log('🔄 Attempting continuation to complete the response...')
      
      try {
        // Make a continuation call to OpenAI
        console.log('🔄 Making continuation call to OpenAI...')
        const continuationController = new AbortController()
        const continuationTimeoutId = setTimeout(() => continuationController.abort(), 120000) // 2 minutes for continuation

        const continuationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-mini',
            max_tokens: 20000,
            temperature: 0.3,
            messages: [
              {
                role: 'system',
                content: 'You are an expert resume optimizer. Continue generating the JSON response from where you left off. Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. Do not wrap the JSON in ```json``` blocks.'
              },
              {
                role: 'user',
                content: prompt
              },
              {
                role: 'assistant',
                content: optimizedContent
              },
              {
                role: 'user',
                content: 'Continue please. Complete the JSON response from where you left off.'
              }
            ],
          }),
          signal: continuationController.signal
        })

        clearTimeout(continuationTimeoutId)

        if (!continuationResponse.ok) {
          throw new Error('Continuation call failed')
        }

        const continuationData = await continuationResponse.json()
        const continuationContent = continuationData.choices[0]?.message?.content || ''
        
        // Update token usage and cost
        totalTokensUsed += (continuationData.usage?.prompt_tokens || 0) + (continuationData.usage?.completion_tokens || 0)
        totalCost += ((continuationData.usage?.prompt_tokens || 0) * 0.00015 + (continuationData.usage?.completion_tokens || 0) * 0.0006) / 1000

        // Concatenate the responses
        finalContent = optimizedContent + continuationContent
        console.log('🔗 Concatenated responses, attempting to parse combined content...')
        console.log('Original content length:', optimizedContent.length)
        console.log('Continuation content length:', continuationContent.length)
        console.log('Final content length:', finalContent.length)
        console.log('Final content preview:', finalContent.substring(0, 300) + '...')

        // Try parsing the combined content
        const combinedParseResult = tryParseJSON(finalContent)
        if (combinedParseResult) {
          optimizedData = combinedParseResult
          console.log('✅ JSON parsing successful after continuation')
        } else {
          console.log('❌ Combined content parsing failed, trying individual parts...')
          
          // Try parsing just the continuation content in case it's a complete response
          const continuationParseResult = tryParseJSON(continuationContent)
          if (continuationParseResult) {
            optimizedData = continuationParseResult
            console.log('✅ JSON parsing successful using only continuation content')
          } else {
            console.error('❌ JSON parsing failed even after continuation - all methods exhausted')
            console.error('Final content length:', finalContent.length)
            console.error('Final content preview:', finalContent.substring(0, 500) + '...')
            
            return NextResponse.json(
              { error: 'Failed to parse optimized data even after continuation attempt' },
              { status: 500 }
            )
          }
        }

      } catch (continuationError: any) {
        console.error('❌ Continuation attempt failed:', continuationError)
        
        // If continuation fails, return error about the continuation failure
        console.error('Raw original content:', optimizedContent)
        return NextResponse.json(
          { error: 'Failed to make continuation call to complete the response' },
          { status: 500 }
        )
      }
    }

    console.log('✅ JSON parsing completed successfully')
    const processingTime = Date.now() - startTime
    const tokensUsed = totalTokensUsed
    const estimatedCost = totalCost

    console.log('📊 Calculating ATS score and metrics...')
    // Calculate ATS score and keyword matching
    const atsScore = calculateATSScore(optimizedData, effectiveJobDescription)
    const keywordsMatched = extractKeywordsMatched(optimizedData, effectiveJobDescription)
    const optimizationSuggestions = generateOptimizationSuggestions(optimizedData, analysisData)

    console.log('💾 Storing optimization in database...')
    // Store the optimization in database using LLMConversation
    let conversationId = null
    try {
      // Create LLM conversation record
      const conversation = await db.lLMConversation.create({
        data: {
          userId: user.id,
          type: 'RESUME_EXTRACTION', // Using existing enum value
          title: `Resume Optimization - ${new Date().toLocaleDateString()}`,
          provider: 'openai',
          model: 'gpt-4.1-mini',
          totalTokensUsed: tokensUsed,
          totalCost: estimatedCost,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      conversationId = conversation.id

      // Create messages for the conversation
      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: `Optimize resume for job:\n\nExtracted Resume ID: ${extractedResumeId}\nJob description: ${effectiveJobDescription ? 'Provided' : 'None'}`,
          messageIndex: 0,
          inputTokens: openaiData.usage?.prompt_tokens || 0,
          totalTokens: openaiData.usage?.prompt_tokens || 0
        }
      })

      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: finalContent,
          messageIndex: 1,
          outputTokens: openaiData.usage?.completion_tokens || 0,
          totalTokens: tokensUsed,
          cost: estimatedCost,
          processingTime: processingTime,
          finishReason: openaiData.choices[0]?.finish_reason || 'stop',
          temperature: 0.3,
          maxTokens: 40000
        }
      })

      console.log('Resume optimization stored in database')
    } catch (dbError) {
      console.error('Failed to store resume optimization:', dbError)
      // Continue without failing the request
    }

    // Generate optimized resume content (HTML/markdown)
    const optimizedResumeContent = generateOptimizedResumeContent(optimizedData, templateId)

    // Save optimized resume to database
    let optimizedResumeId = null
    try {
      const optimizedResume = await db.optimizedResume.create({
        data: {
          userId: user.id,
          content: optimizedResumeContent,
          extractedData: JSON.stringify(optimizedData),
          templateId,
          atsScore,
          keywordsMatched,
          optimizationSuggestions,
          analysisId: analysisId || null,
          documentId: documentId || null,
          jobSummaryId: jobSummaryData?.id || null,
          extractedResumeId: extractedResumeId,
          contentHash,
          provider: 'openai',
          model: 'gpt-4.1-nano',
          conversationId: conversationId || null,
          totalTokensUsed: tokensUsed,
          totalCost: estimatedCost,
          processingTime: processingTime,
          usageCount: 1,
          lastUsedAt: new Date()
        }
      })
      
      optimizedResumeId = optimizedResume.id
      console.log('Optimized resume saved to database')
    } catch (dbError) {
      console.error('Failed to save optimized resume:', dbError)
      // Continue without failing the request
    }

    // Record usage
    if (documentId) {
      try {
        await db.usageRecord.create({
          data: {
            userId: user.id,
            documentId: documentId,
            action: 'RESUME_OPTIMIZATION',
            cost: estimatedCost,
            creditsUsed: 1,
            billingMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format
          }
        })
      } catch (usageError) {
        console.error('Failed to record usage:', usageError)
      }
    }

    console.log(`🎉 Resume optimization completed successfully in ${Date.now() - startTime}ms`)
    const usedContinuation = finalContent !== optimizedContent
    console.log(`📊 Used continuation: ${usedContinuation}`)
    
    return NextResponse.json({
      success: true,
      data: optimizedData,
      content: optimizedResumeContent,
      cached: false,
      usageCount: 1,
      optimizedResumeId,
      metadata: {
        tokensUsed,
        processingTime,
        estimatedCost,
        atsScore,
        keywordsMatched,
        optimizationSuggestions,
        bypassedCache: false,
        usedContinuation,
        finalContentLength: finalContent.length,
        originalContentLength: optimizedContent.length
      }
    })

  } catch (error) {
    console.error('Error optimizing resume:', error)
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateATSScore(optimizedData: any, jobDescription: string): number {
  // Simple ATS score calculation based on completeness and keyword matching
  let score = 0
  
  // Check for required fields
  if (optimizedData.personalInfo?.name) score += 10
  if (optimizedData.personalInfo?.email) score += 10
  if (optimizedData.personalInfo?.phone) score += 5
  if (optimizedData.summary) score += 15
  if (optimizedData.experience?.length > 0) score += 20
  if (optimizedData.education?.length > 0) score += 10
  if (optimizedData.skills?.technical?.length > 0) score += 15
  
  // Check for quantified achievements
  const hasQuantifiedAchievements = optimizedData.experience?.some((exp: any) => 
    exp.achievements?.some((achievement: string) => /\d+/.test(achievement))
  )
  if (hasQuantifiedAchievements) score += 15
  
  return Math.min(score, 100)
}

function extractKeywordsMatched(optimizedData: any, jobDescription: string): string[] {
  if (!jobDescription) return []
  
  const jobKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || []
  const resumeText = JSON.stringify(optimizedData).toLowerCase()
  
  const matched = jobKeywords.filter(keyword => 
    keyword.length > 3 && resumeText.includes(keyword)
  )
  
  // Remove duplicates and return top 10
  return [...new Set(matched)].slice(0, 10)
}

function generateOptimizationSuggestions(optimizedData: any, analysisData: any): string[] {
  const suggestions = []
  
  if (!optimizedData.summary || optimizedData.summary.length < 50) {
    suggestions.push('Add a compelling professional summary')
  }
  
  if (!optimizedData.experience?.length) {
    suggestions.push('Include professional experience section')
  }
  
  if (optimizedData.experience?.some((exp: any) => !exp.achievements?.length)) {
    suggestions.push('Add quantified achievements to experience entries')
  }
  
  if (!optimizedData.skills?.technical?.length) {
    suggestions.push('Include technical skills section')
  }
  
  if (analysisData?.keywordMatch?.missing?.length > 0) {
    suggestions.push(`Add missing keywords: ${analysisData.keywordMatch.missing.slice(0, 3).join(', ')}`)
  }
  
  return suggestions
}

function generateOptimizedResumeContent(optimizedData: any, templateId: string): string {
  // Generate HTML content based on the template
  // This is a simplified version - in a real app, you'd have proper templates
  
  return `
    <div class="resume-${templateId}">
      <header>
        <h1>${optimizedData.personalInfo?.name || 'Name'}</h1>
        <div class="contact-info">
          ${optimizedData.personalInfo?.email ? `<span>${optimizedData.personalInfo.email}</span>` : ''}
          ${optimizedData.personalInfo?.phone ? `<span>${optimizedData.personalInfo.phone}</span>` : ''}
          ${optimizedData.personalInfo?.location ? `<span>${optimizedData.personalInfo.location}</span>` : ''}
        </div>
      </header>
      
      ${optimizedData.summary ? `
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>${optimizedData.summary}</p>
        </section>
      ` : ''}
      
      ${optimizedData.experience?.length ? `
        <section class="experience">
          <h2>Professional Experience</h2>
          ${optimizedData.experience.map((exp: any) => `
            <div class="experience-item">
              <h3>${exp.title} - ${exp.company}</h3>
              <div class="dates">${exp.startDate} - ${exp.endDate}</div>
              ${exp.achievements?.length ? `
                <ul>
                  ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${optimizedData.skills?.technical?.length ? `
        <section class="skills">
          <h2>Technical Skills</h2>
          <div class="skills-list">
            ${optimizedData.skills.technical.join(', ')}
          </div>
        </section>
      ` : ''}
      
      ${optimizedData.education?.length ? `
        <section class="education">
          <h2>Education</h2>
          ${optimizedData.education.map((edu: any) => `
            <div class="education-item">
              <h3>${edu.degree}</h3>
              <div>${edu.school} - ${edu.graduationDate}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}
    </div>
  `
} 