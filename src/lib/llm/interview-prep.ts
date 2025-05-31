import { callAnthropicInterviewPrep } from '@/lib/anthropic-utils'
import { callOpenAIInterviewPrep } from '@/lib/openai-utils'
import { ANTHROPIC_MODELS, CONTEXT_SIZES, OPENAI_MODELS, TEMPERATURES } from '../constants'

interface InterviewQuestion {
  id: string
  question: string
  category: 'behavioral' | 'technical' | 'situational' | 'general'
  difficulty: 'easy' | 'medium' | 'hard'
  suggestedAnswer: string
  tips: string[]
  followUpQuestions?: string[]
}

interface InterviewPrepData {
  questions: InterviewQuestion[]
  overallTips: string[]
  companyResearch?: string[]
  salaryNegotiation?: string[]
}

interface GenerateInterviewQuestionsParams {
  resumeData: any
  jobDescription?: string
  analysisData?: any
  llm?: string
}

export async function generateInterviewQuestions({
  resumeData,
  jobDescription,
  analysisData,
  llm = OPENAI_MODELS.MINI
}: GenerateInterviewQuestionsParams): Promise<InterviewPrepData> {
  
  const systemPrompt = `You are an expert interview coach with 15+ years of experience helping candidates prepare for technical and behavioral interviews across all industries. Your specialty is creating hyper-personalized interview questions that interviewers would ACTUALLY ask based on specific resume details and job requirements.

CRITICAL INSTRUCTIONS:
1. NEVER generate generic questions like "Tell me about yourself" or "What are your strengths"
2. ALWAYS reference specific details from the resume (projects, companies, technologies, achievements)
3. ALWAYS align questions with the actual job requirements and company context
4. Create questions that would realistically be asked by hiring managers at THIS specific company
5. Include follow-up questions that drill deeper into specific experiences
6. Generate questions that test both technical competency AND cultural fit for the role

QUESTION CATEGORIES & APPROACH:

BEHAVIORAL QUESTIONS:
- Reference specific projects/achievements from their resume
- Ask about challenges they faced in their actual work experience
- Probe leadership/collaboration based on their team experiences
- Question decision-making in contexts similar to the target role

TECHNICAL QUESTIONS:
- Based on technologies mentioned in job description vs. resume
- Ask about specific implementations they've done
- Probe depth of knowledge in their claimed expertise areas
- Include scenario-based problems relevant to the target role

SITUATIONAL QUESTIONS:
- Create scenarios specific to the target company's industry/challenges
- Reference the company's tech stack, business model, or known challenges
- Ask how they'd handle situations relevant to the specific role level

COMPANY-SPECIFIC QUESTIONS:
- Research-based questions about why they want THIS specific role
- Questions about how their background fits THIS company's mission/values
- Industry-specific challenges and opportunities

RESPONSE FORMAT:
Generate 8-12 questions with this structure:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "Highly specific question referencing resume details and job context",
      "category": "behavioral|technical|situational|general",
      "difficulty": "easy|medium|hard",
      "suggestedAnswer": "Detailed answer framework with specific examples they should mention",
      "tips": ["Specific, actionable tips for THIS question", "Reference their actual experience", "Mention specific metrics/outcomes to highlight"],
      "followUpQuestions": ["Drill-down questions interviewers would actually ask", "Technical depth questions", "Clarification questions"]
    }
  ],
  "overallTips": ["Tips specific to this role/company type", "Industry-specific advice"],
  "companyResearch": ["Specific research points for THIS company/role", "Industry trends to mention"],
  "salaryNegotiation": ["Role-specific salary negotiation advice", "Industry benchmarks to research"]
}

QUALITY STANDARDS:
- Each question should feel like it was written by someone who actually read their resume
- Questions should reflect the seniority level and role type
- Include technical depth appropriate to the role (junior vs senior vs lead)
- Reference specific technologies, methodologies, or frameworks mentioned
- Create realistic scenarios based on the company's actual business/industry`

  const userPrompt = `CANDIDATE ANALYSIS & INTERVIEW PREP REQUEST:

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `TARGET JOB DESCRIPTION:
${jobDescription}

ANALYSIS TASK: Create interview questions that a hiring manager at THIS specific company would ask based on:
1. The candidate's specific background and experience
2. The exact requirements and technologies mentioned in this job posting
3. The company's industry, size, and business model (infer from job description)
4. Gaps or mismatches between the resume and job requirements` : `NO SPECIFIC JOB DESCRIPTION PROVIDED
ANALYSIS TASK: Create interview questions based on:
1. The candidate's specific background and experience level
2. Common interview patterns for their industry/role type
3. Questions that probe depth in their claimed expertise areas
4. Behavioral questions based on their actual work history`}

${analysisData ? `RESUME ANALYSIS INSIGHTS:
${JSON.stringify(analysisData, null, 2)}

USE THESE INSIGHTS TO:
- Address weaknesses identified in the analysis
- Leverage strengths mentioned in the analysis
- Create questions around areas flagged for improvement
- Reference specific feedback from the resume analysis` : ''}

SPECIFIC REQUIREMENTS:
1. REFERENCE ACTUAL COMPANIES: Mention their previous employers by name in questions
2. REFERENCE ACTUAL PROJECTS: Ask about specific technologies, frameworks, or methodologies they've used
3. PROBE EXPERIENCE DEPTH: Create follow-up questions that test how deep their knowledge really goes
4. INDUSTRY CONTEXT: Make questions relevant to the target industry and company size
5. SENIORITY APPROPRIATE: Match question complexity to their experience level
6. REALISTIC SCENARIOS: Create situations they'd actually face in this specific role

AVOID AT ALL COSTS:
- Generic questions that could apply to anyone
- Questions that don't reference their actual experience
- Overly broad or philosophical questions
- Questions that ignore the job description context

EXAMPLE OF GOOD vs BAD:
❌ BAD: "Tell me about a time you faced a challenge"
✅ GOOD: "I see you worked on [specific project] at [company name] using [technology]. What was the biggest technical challenge you faced when implementing [specific feature], and how did you solve it?"

Generate questions that make it obvious you've read their resume and understand the target role.`

  try {
    // Use the selected LLM model
    let interviewPrepData: InterviewPrepData
    
    if (llm === ANTHROPIC_MODELS.SONNET) {
      // Use Anthropic Claude
      const anthropicResponse = await callAnthropicInterviewPrep(userPrompt, {
        systemPrompt,
        model: ANTHROPIC_MODELS.SONNET,
        maxTokens: CONTEXT_SIZES.LARGE,
        temperature: TEMPERATURES.NORMAL
      })
      interviewPrepData = anthropicResponse.data
    } else {
      // Use OpenAI GPT-4 Mini (default)
      const openaiResponse = await callOpenAIInterviewPrep(userPrompt, {
        systemPrompt,
        model: OPENAI_MODELS.MINI,
        maxTokens: CONTEXT_SIZES.LARGE,
        temperature: TEMPERATURES.NORMAL
      })
      interviewPrepData = openaiResponse.data
    }

    // Validate and ensure we have the required structure
    if (!interviewPrepData.questions || !Array.isArray(interviewPrepData.questions)) {
      throw new Error('Invalid response structure: missing questions array')
    }

    // Add unique IDs if missing
    interviewPrepData.questions = interviewPrepData.questions.map((q, index) => ({
      ...q,
      id: q.id || `question_${index + 1}`
    }))

    // Ensure we have default values for optional fields
    interviewPrepData.overallTips = interviewPrepData.overallTips || []
    interviewPrepData.companyResearch = interviewPrepData.companyResearch || []
    interviewPrepData.salaryNegotiation = interviewPrepData.salaryNegotiation || []

    return interviewPrepData

  } catch (error) {
    console.error('Error generating interview questions:', error)
    
    // Return fallback data if AI generation fails
    return {
      questions: [
        {
          id: 'fallback_1',
          question: 'Tell me about yourself and your professional background.',
          category: 'general',
          difficulty: 'easy',
          suggestedAnswer: 'Provide a concise overview of your professional journey, highlighting key experiences and skills relevant to the role.',
          tips: [
            'Keep your answer to 2-3 minutes',
            'Focus on professional experiences, not personal details',
            'Connect your background to the role you\'re applying for'
          ],
          followUpQuestions: [
            'What motivated you to pursue this career path?',
            'How do you see this role fitting into your career goals?'
          ]
        },
        {
          id: 'fallback_2',
          question: 'What are your greatest strengths?',
          category: 'general',
          difficulty: 'easy',
          suggestedAnswer: 'Choose 2-3 strengths that are directly relevant to the job and provide specific examples.',
          tips: [
            'Use specific examples to demonstrate your strengths',
            'Choose strengths that align with the job requirements',
            'Be authentic and avoid generic answers'
          ]
        },
        {
          id: 'fallback_3',
          question: 'Describe a challenging situation you faced at work and how you handled it.',
          category: 'behavioral',
          difficulty: 'medium',
          suggestedAnswer: 'Use the STAR method (Situation, Task, Action, Result) to structure your response.',
          tips: [
            'Choose a real example that shows problem-solving skills',
            'Focus on your actions and the positive outcome',
            'Demonstrate learning and growth from the experience'
          ]
        }
      ],
      overallTips: [
        'Research the company and role thoroughly before the interview',
        'Prepare specific examples that demonstrate your skills and achievements',
        'Practice your answers out loud to improve delivery',
        'Prepare thoughtful questions to ask the interviewer',
        'Arrive early and dress appropriately for the company culture'
      ],
      companyResearch: [
        'Review the company website, mission, and recent news',
        'Research the interviewer on LinkedIn if possible',
        'Understand the company culture and values',
        'Look up recent company achievements or challenges'
      ],
      salaryNegotiation: [
        'Research market rates for similar positions in your area',
        'Consider the total compensation package, not just salary',
        'Wait for the employer to bring up salary first if possible',
        'Be prepared to justify your salary expectations with examples'
      ]
    }
  }
} 