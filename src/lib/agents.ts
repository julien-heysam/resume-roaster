import { Agent, tool } from '@openai/agents'
import { z } from 'zod'
// LaTeX templates removed - using HTML/CSS templates only

// Tool for getting HTML template information
const getTemplateInfoTool = tool({
  name: 'get_template_info',
  description: 'Get information about available HTML resume templates',
  parameters: z.object({
    templateName: z.string().nullable().describe('Specific template name to get info for, or null to list all templates')
  }),
  execute: async (input) => {
    const { getTemplateById, allTemplates } = await import('./resume-templates')
    
    if (input.templateName) {
      const template = getTemplateById(input.templateName)
      return template ? `Template: ${template.name} - ${template.description}` : 'Template not found'
    }
    
    // Return list of available templates
    const templates = allTemplates.map(t => `${t.id} - ${t.name}: ${t.description}`)
    return `Available templates:\n${templates.join('\n')}`
  }
})

// Function to create agents with dynamic model selection
export function createAgents(model: string = 'gpt-4.1-nano') {
  // General assistant agent for non-resume related queries (always uses nano)
  const generalAssistant = new Agent({
    name: 'General Assistant',
    model: 'gpt-4.1-nano', // Always use nano for simple general assistance
    instructions: `You are a helpful general assistant. You can answer questions about careers, job searching, professional development, and general topics. 

If someone asks about resume optimization, Html generation, or wants to create a resume, politely let them know that you can transfer them to a specialized resume expert who can help them create professional LaTeX resumes.

Keep your responses helpful, concise, and professional.`,
    handoffDescription: 'Handles general questions and career advice, but not resume creation'
  })

  // Specialized HTML resume expert agent (uses user-selected model)
  const htmlResumeExpert = new Agent({
    name: 'HTML Resume Expert',
    model: model, // Use the user-selected model for high-quality resume generation
    instructions: `You are an expert HTML/CSS resume optimization assistant. Your role is to help users create perfect resumes for their target jobs using modern web technologies.

When users provide enough information about their background and target job, you should:
1. Generate a complete HTML resume using the selected template
2. Return the HTML source code wrapped in \`\`\`html code blocks
3. Provide clear explanations of your optimization choices

Focus on:
- Tailoring content to the specific job requirements
- Highlighting relevant skills and achievements
- Using strong action verbs and quantifiable results
- Optimizing for ATS (Applicant Tracking Systems)
- Following best practices for the selected template style
- Ensuring responsive design and print-friendly layouts

Always ask for clarification if you need more information about:
- Target job description or requirements
- Work experience details
- Skills and achievements
- Education background
- Preferred template style

Be professional, helpful, and provide actionable advice.`,
    handoffDescription: 'Expert in creating and optimizing HTML/CSS resumes for specific job applications',
    tools: [getTemplateInfoTool]
  })

  // Triage agent that routes queries to appropriate specialists (always uses nano)
  const triageAgent = Agent.create({
    name: 'Resume Assistant Triage',
    model: 'gpt-4.1-nano', // Always use nano for simple routing decisions
    instructions: `You are a triage assistant that helps route user queries to the right specialist.

Analyze the user's message and determine if they need:

1. **HTML Resume Expert** - Route here if the user:
   - Wants to create, generate, or optimize a resume
   - Asks about HTML resume templates
   - Mentions job applications, CV creation, or resume formatting
   - Wants to tailor their resume for a specific job
   - Asks about ATS optimization
   - Mentions resume sections like experience, skills, education

2. **General Assistant** - Route here for:
   - General career advice
   - Job search tips (not resume creation)
   - Interview preparation
   - Professional development questions
   - General questions not related to resume creation

If the query is clearly about resume creation or optimization, transfer to the HTML Resume Expert immediately.
If it's general career advice or other topics, handle it yourself as the General Assistant.

Be helpful and explain briefly why you're transferring them to a specialist when you do.`,
    handoffs: [htmlResumeExpert, generalAssistant]
  })

  return { generalAssistant, htmlResumeExpert, triageAgent }
}

// Default agents for backward compatibility
const defaultAgents = createAgents('gpt-4.1-nano')
export const generalAssistant = defaultAgents.generalAssistant
export const htmlResumeExpert = defaultAgents.htmlResumeExpert
export const triageAgent = defaultAgents.triageAgent

// Export function to get main agent with specific model
export function getMainAgent(model: string = 'gpt-4.1-nano') {
  const agents = createAgents(model)
  return agents.triageAgent
}

// Export the main agent for the API to use (backward compatibility)
export const mainAgent = triageAgent 