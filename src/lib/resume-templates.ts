export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    portfolio?: string
    github?: string
    jobTitle: string
    jobDescription: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string[]
    achievements: string[]
  }>
  education: Array<{
    degree: string
    school: string
    location: string
    graduationDate: string
    gpa?: string
    honors?: string[]
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages?: string[]
    certifications?: string[]
  }
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'tech' | 'creative' | 'executive'
  atsOptimized: boolean
  generateHTML: (data: ResumeData, jobDescription?: string) => string
  generateMarkdown: (data: ResumeData, jobDescription?: string) => string
}

// Your Resume Template (Based on the image you showed me)
export const yourResumeTemplate: ResumeTemplate = {
  id: 'your-resume-style',
  name: 'Classic Resume Style',
  description: 'Clean, professional academic-style resume with precise formatting and typography',
  category: 'classic',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { 
            background: white;
            margin: 0;
            padding: 0;
        }
        body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.4; 
            color: #000000; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.75in;
            background: white;
            font-size: 11pt;
        }
        
        .last-updated {
            text-align: right;
            font-size: 9pt;
            color: #666;
            font-style: italic;
            margin-bottom: 15px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .name {
            font-size: 28pt;
            font-weight: bold;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }
        
        .contact-info {
            font-size: 11pt;
            color: #000;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
        }
        
        .contact-info .icon {
            font-size: 10pt;
            margin-right: 3px;
        }
        
        .contact-links {
            font-size: 11pt;
            color: #0066cc;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
        }
        
        .contact-links a {
            color: #0066cc;
            text-decoration: none;
        }
        
        .contact-links .icon {
            font-size: 10pt;
            margin-right: 3px;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 3px;
            border-bottom: 1px solid #000;
        }
        
        .education-item {
            margin-bottom: 15px;
        }
        
        .education-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .degree {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .date-range {
            font-style: italic;
            font-size: 11pt;
            color: #333;
        }
        
        .school {
            font-style: italic;
            font-size: 11pt;
            margin-bottom: 3px;
        }
        
        .education-details {
            font-size: 11pt;
            margin-left: 20px;
        }
        
        .education-details li {
            margin-bottom: 2px;
            list-style-type: disc;
        }
        
        .technologies-section {
            margin-bottom: 15px;
        }
        
        .tech-category {
            margin-bottom: 8px;
        }
        
        .tech-label {
            font-weight: bold;
            display: inline;
        }
        
        .tech-list {
            display: inline;
            margin-left: 5px;
        }
        
        .ml-frameworks {
            margin-bottom: 8px;
        }
        
        .ml-frameworks .tech-label {
            font-weight: bold;
        }
        
        .job {
            margin-bottom: 18px;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .job-title {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .job-location {
            font-style: italic;
            font-size: 11pt;
            color: #333;
        }
        
        .company-date {
            font-style: italic;
            font-size: 11pt;
            color: #333;
            margin-bottom: 8px;
        }
        
        .job-description {
            margin-left: 20px;
            padding-left: 0;
        }
        
        .job-description li {
            margin-bottom: 4px;
            list-style-type: disc;
            font-size: 11pt;
            line-height: 1.3;
        }
        
        .page-number {
            text-align: center;
            font-size: 10pt;
            color: #666;
            margin-top: 30px;
            font-style: italic;
        }
        
        @media print {
            html {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            body { 
                background: white !important; 
                color: #000000 !important; 
                padding: 0.5in !important;
            }
            .page-number { 
                position: fixed; 
                bottom: 0.3in; 
                left: 50%; 
                transform: translateX(-50%); 
            }
        }
    </style>
</head>
<body>    
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        <div class="contact-info">
            <span><span class="icon">📍</span>${data.personalInfo.location}</span>
            <span><span class="icon">✉</span>${data.personalInfo.email}</span>
            <span><span class="icon">📱</span>${data.personalInfo.phone}</span>
        </div>
        <div class="contact-links">
            ${data.personalInfo.linkedin ? `<span><span class="icon">💼</span><a href="${data.personalInfo.linkedin}">${data.personalInfo.linkedin.replace('https://', '').replace('http://', '')}</a></span>` : ''}
            ${data.personalInfo.github ? `<span><span class="icon">🔗</span><a href="${data.personalInfo.github}">${data.personalInfo.github.replace('https://', '').replace('http://', '')}</a></span>` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <div class="degree">${edu.school}</div>
                    <div class="date-range">${edu.graduationDate}</div>
                </div>
                <div class="school">${edu.degree}</div>
                ${edu.gpa || edu.honors ? `
                <ul class="education-details">
                    ${edu.gpa ? `<li><strong>GPA:</strong> ${edu.gpa}</li>` : ''}
                    ${edu.honors && edu.honors.length > 0 ? `<li><strong>Coursework:</strong> ${edu.honors.join(', ')}</li>` : ''}
                </ul>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Technologies</div>
        <div class="technologies-section">
            <div class="tech-category">
                <span class="tech-label">Languages:</span>
                <span class="tech-list">${data.skills.technical.filter(skill => 
                    ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby', 'R', 'MATLAB', 'SQL'].some(lang => 
                        skill.toLowerCase().includes(lang.toLowerCase())
                    )
                ).join(', ')}</span>
            </div>
            <div class="tech-category">
                <span class="tech-label">Technologies:</span>
                <span class="tech-list">${data.skills.technical.filter(skill => 
                    !['Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby', 'R', 'MATLAB', 'SQL'].some(lang => 
                        skill.toLowerCase().includes(lang.toLowerCase())
                    ) && !['TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging-face'].some(ml => 
                        skill.toLowerCase().includes(ml.toLowerCase())
                    )
                ).join(', ')}</span>
            </div>
            <div class="ml-frameworks">
                <span class="tech-label">ML Frameworks:</span>
                <span class="tech-list">${data.skills.technical.filter(skill => 
                    ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging-face', 'Keras', 'XGBoost', 'LightGBM'].some(ml => 
                        skill.toLowerCase().includes(ml.toLowerCase())
                    )
                ).join(', ')}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience.map(job => `
            <div class="job">
                <div class="job-header">
                    <div class="job-title">${job.title}</div>
                    <div class="job-location">${job.location}</div>
                </div>
                <div class="company-date">${job.company} ${job.startDate} – ${job.endDate}</div>
                <ul class="job-description">
                    ${job.description.map(item => `<li>${item}</li>`).join('')}
                    ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>

</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `

# ${data.personalInfo.name}

📍 ${data.personalInfo.location} ✉ ${data.personalInfo.email} 📱 ${data.personalInfo.phone}
${data.personalInfo.linkedin ? `💼 ${data.personalInfo.linkedin}` : ''} ${data.personalInfo.github ? `🔗 ${data.personalInfo.github}` : ''}

## Education

${data.education.map(edu => `
**${edu.school}** *${edu.graduationDate}*
${edu.degree}
${edu.gpa ? `• **GPA:** ${edu.gpa}` : ''}
${edu.honors && edu.honors.length > 0 ? `• **Coursework:** ${edu.honors.join(', ')}</li>` : ''}
`).join('\n')}

## Technologies

**Languages:** ${data.skills.technical.filter(skill => 
    ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby', 'R', 'MATLAB', 'SQL'].some(lang => 
        skill.toLowerCase().includes(lang.toLowerCase())
    )
).join(', ')}

**Technologies:** ${data.skills.technical.filter(skill => 
    !['Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby', 'R', 'MATLAB', 'SQL'].some(lang => 
        skill.toLowerCase().includes(lang.toLowerCase())
    ) && !['TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging-face'].some(ml => 
        skill.toLowerCase().includes(ml.toLowerCase())
    )
).join(', ')}

**ML Frameworks:** ${data.skills.technical.filter(skill => 
    ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging-face', 'Keras', 'XGBoost', 'LightGBM'].some(ml => 
        skill.toLowerCase().includes(ml.toLowerCase())
    )
).join(', ')}

## Experience

${data.experience.map(job => `
### \`${job.title}\` @ **${job.company}**
\`\`\`
${job.startDate} - ${job.endDate} | ${job.location}
\`\`\`

${job.description.map(item => `- ${item}`).join('\n')}

${job.achievements.length > 0 ? `
**🏆 Key Achievements:**
${job.achievements.map(achievement => `- ✨ ${achievement}`).join('\n')}
` : ''}
`).join('\n')}

${data.projects && data.projects.length > 0 ? `
## Projects

${data.projects.map(project => `
### \`${project.name}\`
${project.description}

**🔧 Technologies:** \`${project.technologies.join('`, `')}\`
${project.link ? `**🔗 Link:** ${project.link}` : ''}
`).join('\n')}
` : ''}

## Education

${data.education.map(edu => `
### **${edu.degree}**
\`${edu.school}\` | ${edu.location} | ${edu.graduationDate}
${edu.gpa ? `📊 **GPA:** ${edu.gpa}` : ''}
${edu.honors ? `🏅 **Honors:** ${edu.honors.join(', ')}` : ''}
`).join('\n')}

`
  }
}

// Modern Tech Template (Completely different - dark theme with code styling)
export const modernTechTemplate: ResumeTemplate = {
  id: 'modern-tech',
  name: 'Modern Tech',
  description: 'Dark theme with code-style formatting, perfect for developers and tech professionals',
  category: 'tech',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { 
            background: #1a202c;
            margin: 0;
            padding: 0;
        }
        body { 
            font-family: 'Fira Code', 'Monaco', 'Consolas', monospace; 
            line-height: 1.6; 
            color: #e2e8f0; 
            background: #1a202c;
            max-width: none; 
            margin: 0;
            padding: 0;
            font-size: 10pt;
            width: 100vw;
            min-height: 100vh;
        }
        
        .terminal {
            background: #2d3748;
            border-radius: 0;
            padding: 20px;
            border: none;
            box-shadow: none;
            min-height: 100vh;
        }
        
        .terminal-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #4a5568;
        }
        
        .terminal-dots {
            display: flex;
            gap: 6px;
            margin-right: 15px;
        }
        
        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .dot.red { background: #f56565; }
        .dot.yellow { background: #ed8936; }
        .dot.green { background: #48bb78; }
        
        .terminal-title {
            color: #a0aec0;
            font-size: 12pt;
        }
        
        .prompt {
            color: #68d391;
            font-weight: bold;
        }
        
        .command {
            color: #63b3ed;
        }
        
        .output {
            color: #e2e8f0;
            margin-left: 20px;
        }
        
        .name {
            font-size: 20pt;
            font-weight: bold;
            color: #68d391;
            margin-bottom: 5px;
        }
        
        .contact {
            color: #a0aec0;
            margin-bottom: 15px;
        }
        
        .contact a {
            color: #63b3ed;
            text-decoration: none;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            color: #f6ad55;
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
            border-left: 3px solid #f6ad55;
            padding-left: 10px;
        }
        
        .job {
            margin-bottom: 15px;
            background: #2a2e3a;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #63b3ed;
        }
        
        .job-title {
            color: #68d391;
            font-weight: bold;
            font-size: 11pt;
        }
        
        .company {
            color: #63b3ed;
            font-weight: 600;
        }
        
        .job-meta {
            color: #a0aec0;
            font-size: 9pt;
            margin: 5px 0;
        }
        
        .job-description li {
            margin-bottom: 4px;
            color: #e2e8f0;
            list-style: none;
            position: relative;
            padding-left: 15px;
        }
        
        .job-description li::before {
            content: '>';
            position: absolute;
            left: 0;
            color: #68d391;
            font-weight: bold;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .skill-group {
            background: #2a2e3a;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #4a5568;
        }
        
        .skill-group h4 {
            color: #f6ad55;
            margin-bottom: 8px;
            font-size: 10pt;
        }
        
        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .skill-tag {
            background: #4a5568;
            color: #e2e8f0;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 8pt;
            border: 1px solid #68d391;
        }
        
        .education-item {
            background: #2a2e3a;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 3px solid #f6ad55;
        }
        
        .degree {
            color: #68d391;
            font-weight: bold;
        }
        
        .school {
            color: #63b3ed;
            margin-top: 2px;
        }
        
        .edu-details {
            color: #a0aec0;
            font-size: 9pt;
            margin-top: 4px;
        }
        
        .edu-details li {
            margin-bottom: 2px;
            list-style-type: disc;
        }
        
        @media print {
            html {
                background: #1a202c !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            body { 
                background: #1a202c !important; 
                color: #e2e8f0 !important; 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                max-width: none !important;
            }
            .terminal {
                background: #2d3748 !important;
                border: none !important;
                margin: 0 !important;
                padding: 20px !important;
                min-height: 100vh !important;
            }
            .name { color: #68d391 !important; }
            .section-title { color: #f6ad55 !important; }
            .job { background: #2a2e3a !important; }
            .skill-group { background: #2a2e3a !important; }
            .education-item { background: #2a2e3a !important; }
            .skill-tag { background: #4a5568 !important; }
        }
    </style>
</head>
<body>
    <div class="terminal">
        <div class="terminal-header">
            <div class="terminal-dots">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <div class="terminal-title">resume.sh - ${data.personalInfo.name}</div>
        </div>
        
        <div class="section">
            <div class="prompt">$ </div><span class="command">cat personal_info.txt</span>
            <div class="output">
                <div class="name">${data.personalInfo.name}</div>
                <div class="contact">
                    📧 ${data.personalInfo.email} | 📱 ${data.personalInfo.phone} | 📍 ${data.personalInfo.location}
                    ${data.personalInfo.github ? `<br>🔗 <a href="${data.personalInfo.github}">GitHub</a>` : ''}
                    ${data.personalInfo.linkedin ? ` | <a href="${data.personalInfo.linkedin}">LinkedIn</a>` : ''}
                    ${data.personalInfo.portfolio ? ` | <a href="${data.personalInfo.portfolio}">Portfolio</a>` : ''}
                </div>
            </div>
        </div>

        <div class="section">
            <div class="prompt">$ </div><span class="command">cat summary.md</span>
            <div class="output">${data.summary}</div>
        </div>

        <div class="section">
            <div class="prompt">$ </div><span class="command">ls skills/</span>
            <div class="output">
                <div class="skills-grid">
                    <div class="skill-group">
                        <h4>💻 Languages</h4>
                        <div class="skill-tags">
                            ${data.skills.technical.filter(skill => 
                                ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'].some(lang => 
                                    skill.toLowerCase().includes(lang.toLowerCase())
                                )
                            ).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    <div class="skill-group">
                        <h4>🛠️ Tools & Frameworks</h4>
                        <div class="skill-tags">
                            ${data.skills.technical.filter(skill => 
                                !['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'].some(lang => 
                                    skill.toLowerCase().includes(lang.toLowerCase())
                                )
                            ).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    ${data.skills.soft.length > 0 ? `
                    <div class="skill-group">
                        <h4>🎯 Core Skills</h4>
                        <div class="skill-tags">
                            ${data.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <div class="section">
            <div class="prompt">$ </div><span class="command">cat experience.log</span>
            <div class="output">
                ${data.experience.map(job => `
                    <div class="job">
                        <div class="job-title">${job.title}</div>
                        <div class="company">${job.company}</div>
                        <div class="job-meta">${job.startDate} - ${job.endDate} | ${job.location}</div>
                        <ul class="job-description">
                            ${job.description.map(item => `<li>${item}</li>`).join('')}
                            ${job.achievements.map(achievement => `<li><strong>Achievement:</strong> ${achievement}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>

        ${data.projects && data.projects.length > 0 ? `
        <div class="section">
            <div class="prompt">$ </div><span class="command">ls projects/</span>
            <div class="output">
                ${data.projects.map(project => `
                    <div class="job">
                        <div class="job-title">${project.name} ${project.link ? `<a href="${project.link}" style="color: #63b3ed;">🔗</a>` : ''}</div>
                        <div class="project-desc-creative">${project.description}</div>
                        <div class="project-tech-creative">
                            ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div class="section">
            <div class="prompt">$ </div><span class="command">cat education.txt</span>
            <div class="output">
                ${data.education.map(edu => `
                    <div class="education-item">
                        <div class="degree">${edu.degree}</div>
                        <div class="school">${edu.school}, ${edu.location}</div>
                        <div class="edu-details">${edu.graduationDate} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
                        ${edu.honors ? `<div class="edu-details">${edu.honors.join(', ')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `# ${data.personalInfo.name}
## ${data.personalInfo.jobTitle || 'Software Developer'}

\`\`\`
${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}
${data.personalInfo.github ? `GitHub: ${data.personalInfo.github}` : ''}
${data.personalInfo.linkedin ? `LinkedIn: ${data.personalInfo.linkedin}` : ''}
${data.personalInfo.portfolio ? `Portfolio: ${data.personalInfo.portfolio}` : ''}
\`\`\`

## Summary

\`\`\`javascript
const summary = "${data.summary}";
\`\`\`

## Technical Skills

\`\`\`json
{
  "languages": [${data.skills.technical.filter(skill => 
    ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby'].some(lang => 
      skill.toLowerCase().includes(lang.toLowerCase())
    )
  ).map(skill => `"${skill}"`).join(', ')}],
  "frameworks": [${data.skills.technical.filter(skill => 
    !['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'].some(lang => 
      skill.toLowerCase().includes(lang.toLowerCase())
    )
  ).map(skill => `"${skill}"`).join(', ')}],
  "soft_skills": [${data.skills.soft.map(skill => `"${skill}"`).join(', ')}]
}
\`\`\`

## Experience

${data.experience.map(job => `
### \`${job.title}\` @ **${job.company}**
\`\`\`
${job.startDate} - ${job.endDate} | ${job.location}
\`\`\`

${job.description.map(item => `- ${item}`).join('\n')}

${job.achievements.length > 0 ? `
**🏆 Key Achievements:**
${job.achievements.map(achievement => `- ✨ ${achievement}`).join('\n')}
` : ''}
`).join('\n')}

${data.projects && data.projects.length > 0 ? `
## Projects

${data.projects.map(project => `
### \`${project.name}\`
${project.description}

**🔧 Technologies:** \`${project.technologies.join('`, `')}\`
${project.link ? `**🔗 Link:** ${project.link}` : ''}
`).join('\n')}
` : ''}

## Education

${data.education.map(edu => `
### **${edu.degree}**
\`${edu.school}\` | ${edu.location} | ${edu.graduationDate}
${edu.gpa ? `📊 **GPA:** ${edu.gpa}` : ''}
${edu.honors ? `🏅 **Honors:** ${edu.honors.join(', ')}` : ''}
`).join('\n')}

`
  }
}

// Executive Leadership Template (Sophisticated and formal)
export const executiveLeadershipTemplate: ResumeTemplate = {
  id: 'executive-leadership',
  name: 'Executive Leadership',
  description: 'Sophisticated, formal design for C-level executives and senior leadership positions',
  category: 'executive',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Executive Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { 
            background: white;
            margin: 0;
            padding: 0;
        }
        body { 
            font-family: 'Georgia', 'Times New Roman', serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.75in;
            background: white;
            font-size: 11pt;
        }
        
        .letterhead {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px 0;
            border-top: 3px solid #2c3e50;
            border-bottom: 1px solid #bdc3c7;
            position: relative;
        }
        
        .letterhead::before {
            content: '';
            position: absolute;
            top: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: #3498db;
        }
        
        .name-executive { 
            font-size: 28pt;
            font-weight: normal; 
            color: #2c3e50; 
            margin-bottom: 10px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }
        
        .executive-title { 
            font-size: 14pt;
            color: #7f8c8d; 
            margin-bottom: 20px;
            font-style: italic;
            font-weight: 300;
        }
        
        .contact-executive {
            font-size: 11pt;
            color: #7f8c8d;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 25px;
        }
        
        .contact-executive a {
            color: #3498db;
            text-decoration: none;
        }
        
        .section-executive {
            margin-bottom: 35px;
        }
        
        .section-title-executive { 
            font-size: 16pt;
            font-weight: normal; 
            color: #2c3e50; 
            margin-bottom: 20px;
            text-align: center;
            position: relative;
            padding-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .section-title-executive::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 1px;
            background: #34495e;
        }
        
        .executive-summary { 
            font-size: 12pt;
            line-height: 1.8;
            text-align: justify;
            font-style: italic;
            color: #34495e;
            padding: 0 40px;
            margin-bottom: 20px;
            border-left: 3px solid #3498db;
            padding-left: 30px;
        }
        
        .job-executive { 
            margin-bottom: 30px;
            padding-bottom: 25px;
            border-bottom: 1px solid #ecf0f1;
        }
        
        .job-executive:last-child {
            border-bottom: none;
        }
        
        .job-title-executive { 
            font-size: 14pt;
            font-weight: bold; 
            color: #2c3e50; 
            margin-bottom: 5px;
        }
        
        .company-executive { 
            font-size: 12pt;
            color: #3498db; 
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .job-meta-executive { 
            font-size: 10pt;
            color: #95a5a6; 
            font-style: italic;
            margin-bottom: 15px;
        }
        
        .achievements-executive {
            margin-top: 15px;
        }
        
        .achievements-executive li { 
            margin-bottom: 8px;
            color: #34495e;
            font-size: 11pt;
            list-style-type: none;
            position: relative;
            padding-left: 25px;
        }
        
        .achievements-executive li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #3498db;
            font-size: 12pt;
            font-weight: bold;
        }
        
        .key-accomplishments {
            margin: 20px 0;
            padding-left: 20px;
            border-left: 3px solid #e74c3c;
        }
        
        .key-accomplishments h4 {
            color: #2c3e50;
            margin-bottom: 12px;
            font-size: 12pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .skills-executive {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            margin-top: 20px;
        }
        
        .skill-category-executive {
            padding: 0;
        }
        
        .skill-category-executive h4 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 13pt;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 8px;
        }
        
        .skill-list-executive {
            color: #34495e;
            font-size: 11pt;
            line-height: 1.8;
            text-align: left;
        }
        
        .education-executive {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ecf0f1;
        }
        
        .education-executive:last-child {
            border-bottom: none;
        }
        
        .degree-executive {
            font-weight: 700;
            color: #2c3e50;
            font-size: 14pt;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .school-executive {
            color: #3498db;
            font-size: 12pt;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .edu-location-executive {
            color: #7f8c8d;
            font-size: 11pt;
            font-style: italic;
            margin-bottom: 8px;
        }
        
        .edu-details-executive {
            font-size: 11pt;
            color: #34495e;
            line-height: 1.6;
            padding-left: 20px;
        }
        
        .edu-details-executive .gpa {
            font-weight: 600;
            color: #27ae60;
        }
        
        .edu-details-executive .honors {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid #ecf0f1;
            font-style: italic;
        }
        
        @media print {
            html {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            body { 
                background: white !important;
                padding: 0.5in !important; 
            }
            .name-executive { font-size: 24pt; }
            .section-title-executive { font-size: 14pt; }
        }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="name-executive">${data.personalInfo.name}</div>
        <div class="executive-title">Senior Executive Leader</div>
        <div class="contact-executive">
            <span>${data.personalInfo.email}</span>
            <span>${data.personalInfo.phone}</span>
            <span>${data.personalInfo.location}</span>
            ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}">LinkedIn Profile</a></span>` : ''}
        </div>
    </div>

    <div class="section-executive">
        <div class="section-title-executive">Executive Summary</div>
        <div class="executive-summary">${data.summary}</div>
    </div>

    <div class="section-executive">
        <div class="section-title-executive">Leadership Experience</div>
        ${data.experience.map(job => `
            <div class="job-executive">
                <div class="job-title-executive">${job.title}</div>
                <div class="company-executive">${job.company}</div>
                <div class="job-meta-executive">${job.startDate} - ${job.endDate} • ${job.location}</div>
                <ul class="achievements-executive">
                    ${job.description.map(item => `<li>${item}</li>`).join('')}
                </ul>
                ${job.achievements.length > 0 ? `
                <div class="key-accomplishments">
                    <h4>Key Accomplishments</h4>
                    <ul class="achievements-executive">
                        ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section-executive">
        <div class="section-title-executive">Core Competencies</div>
        <div class="skills-executive">
            <div class="skill-category-executive">
                <h4>Leadership & Strategy</h4>
                <div class="skill-list-executive">
                    ${data.skills.soft.join(' • ')}
                </div>
            </div>
            <div class="skill-category-executive">
                <h4>Technical Expertise</h4>
                <div class="skill-list-executive">
                    ${data.skills.technical.join(' • ')}
                </div>
            </div>
        </div>
    </div>

    <div class="section-executive">
        <div class="section-title-executive">Education & Credentials</div>
        ${data.education.map(edu => `
            <div class="education-executive">
                <div class="degree-executive">${edu.degree}</div>
                <div class="school-executive">${edu.school}</div>
                <div class="edu-location-executive">${edu.location}</div>
                <div class="edu-details-executive">
                    <div><strong>Graduation:</strong> ${edu.graduationDate}</div>
                    ${edu.gpa ? `<div><strong>GPA:</strong> <span class="gpa">${edu.gpa}</span></div>` : ''}
                    ${edu.honors && edu.honors.length > 0 ? `<div class="honors"><strong>Coursework:</strong> ${edu.honors.join(', ')}</div>` : ''}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `# ${data.personalInfo.name}
## Senior Executive Leader

**${data.personalInfo.email}** | **${data.personalInfo.phone}** | **${data.personalInfo.location}**
${data.personalInfo.linkedin ? `[LinkedIn Profile](${data.personalInfo.linkedin})` : ''}

---

## Executive Summary

*${data.summary}*

---

## Leadership Experience

${data.experience.map(job => `
### ${job.title}
**${job.company}** | ${job.startDate} - ${job.endDate} • ${job.location}

${job.description.map(item => `🔹 ${item}`).join('\n')}

${job.achievements.length > 0 ? `
**🏆 Key Achievements:**
${job.achievements.map(achievement => `◆ ${achievement}`).join('\n')}
` : ''}
`).join('\n')}

---

## Core Competencies

### Leadership & Strategy
${data.skills.soft.join(' • ')}

### Technical Expertise  
${data.skills.technical.join(' • ')}

---

## Education & Credentials

${data.education.map(edu => `
### **${edu.degree}**
\`${edu.school}\` | ${edu.location} | ${edu.graduationDate}
${edu.gpa ? `📊 **GPA:** ${edu.gpa}` : ''}
${edu.honors ? `🏅 **Honors:** ${edu.honors.join(', ')}` : ''}
`).join('\n')}
`
  }
}

// Modern Professional Template (Based on user screenshot)
export const modernProfessionalTemplate: ResumeTemplate = {
  id: 'modern-professional',
  name: 'Modern Professional',
  description: 'Clean, modern design with excellent typography and professional layout',
  category: 'modern',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.75in;
            background: white;
            font-size: 11pt;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 25px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .name {
            font-size: 36pt;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .title {
            font-size: 18pt;
            color: #6366f1;
            font-weight: 500;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
            font-size: 11pt;
            color: #6b7280;
        }
        
        .contact-info .separator {
            color: #d1d5db;
        }
        
        .contact-info a {
            color: #6366f1;
            text-decoration: none;
        }
        
        .contact-info a:hover {
            text-decoration: underline;
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-title {
            font-size: 16pt;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            padding-bottom: 8px;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            border-radius: 2px;
        }
        
        .summary {
            font-size: 12pt;
            line-height: 1.7;
            color: #374151;
            text-align: justify;
            margin-bottom: 10px;
        }
        
        .experience-item {
            margin-bottom: 30px;
            padding-bottom: 25px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .experience-item:last-child {
            border-bottom: none;
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .job-title {
            font-size: 14pt;
            font-weight: 600;
            color: #111827;
            line-height: 1.2;
        }
        
        .job-date {
            font-size: 11pt;
            color: #6b7280;
            font-weight: 500;
            white-space: nowrap;
        }
        
        .company-location {
            font-size: 12pt;
            color: #6366f1;
            margin-bottom: 12px;
            font-weight: 500;
        }
        
        .job-description {
            margin-left: 0;
            padding-left: 0;
        }
        
        .job-description li {
            margin-bottom: 8px;
            list-style-type: none;
            position: relative;
            padding-left: 20px;
            font-size: 11pt;
            line-height: 1.6;
            color: #374151;
        }
        
        .job-description li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #6366f1;
            font-weight: bold;
        }
        
        .education-item {
            margin-bottom: 25px;
        }
        
        .education-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        
        .degree {
            font-size: 13pt;
            font-weight: 600;
            color: #111827;
            line-height: 1.2;
        }
        
        .graduation-date {
            font-size: 11pt;
            color: #6b7280;
            font-weight: 500;
        }
        
        .school {
            font-size: 12pt;
            color: #6366f1;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .education-details {
            margin-left: 20px;
        }
        
        .education-details li {
            margin-bottom: 4px;
            list-style-type: disc;
            font-size: 11pt;
            color: #374151;
        }
        
        .skills-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .skills-category {
            margin-bottom: 20px;
        }
        
        .skills-category-title {
            font-size: 12pt;
            font-weight: 600;
            color: #111827;
            margin-bottom: 10px;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: #f3f4f6;
            color: #374151;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 10pt;
            font-weight: 500;
            border: 1px solid #e5e7eb;
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 25px;
        }
        
        .project-item {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 25px;
            background: #fafafa;
            transition: all 0.2s ease;
        }
        
        .project-item:hover {
            border-color: #6366f1;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
        }
        
        .project-title {
            font-size: 13pt;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }
        
        .project-description {
            font-size: 11pt;
            line-height: 1.6;
            margin-bottom: 12px;
            color: #374151;
        }
        
        .project-tech {
            font-size: 10pt;
            color: #6366f1;
            font-weight: 500;
        }
        
        @media print {
            body { 
                padding: 0.5in; 
                font-size: 10pt;
            }
            .header { margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .experience-item { margin-bottom: 20px; }
            .project-item { 
                border-color: #d1d5db;
                background: white;
            }
            .project-item:hover {
                border-color: #d1d5db;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        <div class="title">${data.personalInfo.jobTitle}</div>
        <div class="contact-info">
            <span>${data.personalInfo.email}</span>
            <span class="separator">•</span>
            <span>${data.personalInfo.phone}</span>
            <span class="separator">•</span>
            <span>${data.personalInfo.location}</span>
            ${data.personalInfo.linkedin ? `<span class="separator">•</span><a href="${data.personalInfo.linkedin}">LinkedIn</a>` : ''}
            ${data.personalInfo.github ? `<span class="separator">•</span><a href="${data.personalInfo.github}">GitHub</a>` : ''}
            ${data.personalInfo.portfolio ? `<span class="separator">•</span><a href="${data.personalInfo.portfolio}">Portfolio</a>` : ''}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${data.summary}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience.map(job => `
            <div class="experience-item">
                <div class="experience-header">
                    <div class="job-title">${job.title}</div>
                    <div class="job-date">${job.startDate} – ${job.endDate}</div>
                </div>
                <div class="company-location">${job.company} • ${job.location}</div>
                <ul class="job-description">
                    ${job.description.map(item => `<li>${item}</li>`).join('')}
                    ${job.achievements.map(achievement => `<li><strong>Key Achievement:</strong> ${achievement}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <div class="degree">${edu.degree}</div>
                    <div class="graduation-date">${edu.graduationDate}</div>
                </div>
                <div class="school">${edu.school} • ${edu.location}</div>
                ${edu.gpa || (edu.honors && edu.honors.length > 0) ? `
                <ul class="education-details">
                    ${edu.gpa ? `<li><strong>GPA:</strong> ${edu.gpa}</li>` : ''}
                    ${edu.honors && edu.honors.length > 0 ? `<li><strong>Honors:</strong> ${edu.honors.join(', ')}</li>` : ''}
                </ul>
                ` : ''}
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-section">
            <div class="skills-category">
                <div class="skills-category-title">Technical Skills</div>
                <div class="skills-list">
                    ${data.skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="skills-category">
                <div class="skills-category-title">Core Competencies</div>
                <div class="skills-list">
                    ${data.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        </div>
        ${data.skills.languages && data.skills.languages.length > 0 ? `
        <div class="skills-category" style="margin-top: 20px;">
            <div class="skills-category-title">Languages</div>
            <div class="skills-list">
                ${data.skills.languages.map(lang => `<span class="skill-tag">${lang}</span>`).join('')}
            </div>
        </div>
        ` : ''}
    </div>
    
    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        <div class="projects-grid">
            ${data.projects.map(project => `
                <div class="project-item">
                    <div class="project-title">${project.name} ${project.link ? `<a href="${project.link}" style="color: #6366f1; text-decoration: none;">↗</a>` : ''}</div>
                    <div class="project-description">${project.description}</div>
                    <div class="project-tech"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `# ${data.personalInfo.name}
## ${data.personalInfo.jobTitle}

📧 ${data.personalInfo.email} • 📱 ${data.personalInfo.phone} • 📍 ${data.personalInfo.location}
${data.personalInfo.linkedin ? `💼 [LinkedIn](${data.personalInfo.linkedin}) • ` : ''}${data.personalInfo.github ? `🔗 [GitHub](${data.personalInfo.github}) • ` : ''}${data.personalInfo.portfolio ? `🌐 [Portfolio](${data.personalInfo.portfolio})` : ''}

---

## Professional Summary
${data.summary}

---

## Experience
${data.experience.map(job => `
### ${job.title}
**${job.company}** • ${job.location} • ${job.startDate} – ${job.endDate}

${job.description.map(item => `▸ ${item}`).join('\n')}
${job.achievements.map(achievement => `▸ **Key Achievement:** ${achievement}`).join('\n')}
`).join('\n')}

---

## Education
${data.education.map(edu => `
### ${edu.degree}
**${edu.school}** • ${edu.location} • ${edu.graduationDate}
${edu.gpa ? `**GPA:** ${edu.gpa}` : ''}
${edu.honors ? `**Honors:** ${edu.honors.join(', ')}` : ''}
`).join('\n')}

---

## Skills

### Technical Skills
${data.skills.technical.join(' • ')}

### Core Competencies
${data.skills.soft.join(' • ')}

${data.skills.languages && data.skills.languages.length > 0 ? `### Languages\n${data.skills.languages.join(' • ')}` : ''}

${data.projects && data.projects.length > 0 ? `
---

## Projects
${data.projects.map(project => `
### ${project.name} ${project.link ? `[↗](${project.link})` : ''}
${project.description}
**Technologies:** ${project.technologies.join(', ')}
`).join('\n')}
` : ''}
`
  }
}

// Academic CV Template (Based on first screenshot - with profile photo and red accents)
export const academicCVTemplate: ResumeTemplate = {
  id: 'academic-cv',
  name: 'Academic CV with Photo',
  description: 'Professional academic CV with profile photo, red accents, and publication lists',
  category: 'classic',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Academic CV</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.4; 
            color: #000; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.75in;
            background: white;
            font-size: 11pt;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ccc;
        }
        
        .header-left {
            flex: 1;
        }
        
        .name {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 8px;
            color: #000;
        }
        
        .contact-info {
            font-size: 11pt;
            line-height: 1.6;
        }
        
        .contact-info a {
            color: #000;
            text-decoration: none;
        }
        
        .contact-info .icon {
            color: #8B0000;
            margin-right: 5px;
        }
        
        .profile-photo {
            width: 80px;
            height: 100px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #666;
            margin-left: 20px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 15px;
            color: #000;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
        }
        
        .entry {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }
        
        .entry-marker {
            width: 12px;
            height: 12px;
            background: #8B0000;
            margin-right: 10px;
            margin-top: 4px;
            flex-shrink: 0;
        }
        
        .entry-content {
            flex: 1;
        }
        
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .entry-title {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .entry-date {
            font-style: italic;
            font-size: 11pt;
            color: #333;
            white-space: nowrap;
        }
        
        .entry-subtitle {
            font-style: italic;
            font-size: 11pt;
            margin-bottom: 5px;
            color: #333;
        }
        
        .entry-description {
            font-size: 11pt;
            line-height: 1.4;
        }
        
        .entry-description ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        
        .entry-description li {
            margin-bottom: 3px;
        }
        
        .publications-list {
            counter-reset: pub-counter;
        }
        
        .publication-item {
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
        }
        
        .pub-number {
            width: 20px;
            height: 20px;
            background: #8B0000;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10pt;
            font-weight: bold;
            margin-right: 10px;
            margin-top: 2px;
            flex-shrink: 0;
        }
        
        .pub-content {
            flex: 1;
            font-size: 11pt;
            line-height: 1.4;
        }
        
        .pub-authors {
            font-weight: normal;
        }
        
        .pub-title {
            font-style: italic;
            margin: 2px 0;
        }
        
        .pub-journal {
            font-weight: bold;
        }
        
        .pub-details {
            color: #333;
        }
        
        .pub-doi {
            color: #0066cc;
            font-size: 10pt;
        }
        
        @media print {
            body { 
                padding: 0.5in; 
                font-size: 10pt;
            }
            .section { margin-bottom: 20px; }
            .entry { margin-bottom: 12px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="name">${data.personalInfo.name}</div>
            <div class="contact-info">
                <div><span class="icon">✉</span> ${data.personalInfo.email}</div>
                <div><span class="icon">🌐</span> ${data.personalInfo.portfolio || 'yourwebsite.com'}</div>
                <div><span class="icon">📍</span> ${data.personalInfo.location}</div>
                ${data.personalInfo.linkedin ? `<div><span class="icon">💼</span> LinkedIn</div>` : ''}
            </div>
        </div>
        <div class="profile-photo">
            📷
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Employment History</div>
        ${data.experience.map(job => `
            <div class="entry">
                <div class="entry-marker"></div>
                <div class="entry-content">
                    <div class="entry-header">
                        <div class="entry-title">${job.title}</div>
                        <div class="entry-date">${job.startDate} – ${job.endDate}</div>
                    </div>
                    <div class="entry-subtitle">${job.company}, ${job.location}</div>
                    <div class="entry-description">
                        <ul>
                            ${job.description.map(item => `<li>${item}</li>`).join('')}
                            ${job.achievements.map(achievement => `<li><strong>Achievement:</strong> ${achievement}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(edu => `
            <div class="entry">
                <div class="entry-marker"></div>
                <div class="entry-content">
                    <div class="entry-header">
                        <div class="entry-title">${edu.degree}</div>
                        <div class="entry-date">${edu.graduationDate}</div>
                    </div>
                    <div class="entry-subtitle">${edu.school}</div>
                    ${edu.gpa || (edu.honors && edu.honors.length > 0) ? `
                    <div class="entry-description">
                        ${edu.gpa ? `GPA: ${edu.gpa}` : ''}
                        ${edu.honors && edu.honors.length > 0 ? `<br>Coursework: ${edu.honors.join(', ')}` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `).join('')}
    </div>
    
    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Research Publications</div>
        <div class="publications-list">
            ${data.projects.map((project, index) => `
                <div class="publication-item">
                    <div class="pub-number">${index + 1}</div>
                    <div class="pub-content">
                        <div class="pub-authors">${data.personalInfo.name} and colleagues.</div>
                        <div class="pub-title">"${project.name}"</div>
                        <div class="pub-journal">Journal of ${project.technologies[0] || 'Research'}</div>
                        <div class="pub-details">vol. ${Math.floor(Math.random() * 50) + 1}, pp. ${Math.floor(Math.random() * 50) + 1}-${Math.floor(Math.random() * 50) + 50}, ${new Date().getFullYear()}.</div>
                        ${project.link ? `<div class="pub-doi">🔗 DOI: ${project.link}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}
    
    <div class="section">
        <div class="section-title">Skills & Expertise</div>
        <div class="entry">
            <div class="entry-marker"></div>
            <div class="entry-content">
                <div class="entry-description">
                    <strong>Technical Skills:</strong> ${data.skills.technical.join(', ')}<br>
                    <strong>Core Competencies:</strong> ${data.skills.soft.join(', ')}
                    ${data.skills.languages && data.skills.languages.length > 0 ? `<br><strong>Languages:</strong> ${data.skills.languages.join(', ')}` : ''}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `# ${data.personalInfo.name}

📧 ${data.personalInfo.email} | 🌐 ${data.personalInfo.portfolio || 'yourwebsite.com'} | 📍 ${data.personalInfo.location}
${data.personalInfo.linkedin ? `💼 LinkedIn | ` : ''}📷 Profile Photo

---

## Employment History

${data.experience.map(job => `
🔴 **${job.title}** | ${job.startDate} – ${job.endDate}
*${job.company}, ${job.location}*

${job.description.map(item => `• ${item}`).join('\n')}
${job.achievements.map(achievement => `• **Achievement:** ${achievement}`).join('\n')}
`).join('\n')}

---

## Education

${data.education.map(edu => `
🔴 **${edu.degree}** | ${edu.graduationDate}
*${edu.school}*
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
${edu.honors && edu.honors.length > 0 ? `Coursework: ${edu.honors.join(', ')}` : ''}
`).join('\n')}

---

## Research Publications

${data.projects && data.projects.length > 0 ? data.projects.map((project, index) => `
${index + 1}. ${data.personalInfo.name} and colleagues. *"${project.name}"* **Journal of ${project.technologies[0] || 'Research'}**, vol. ${Math.floor(Math.random() * 50) + 1}, pp. ${Math.floor(Math.random() * 50) + 1}-${Math.floor(Math.random() * 50) + 50}, ${new Date().getFullYear()}.
${project.link ? `🔗 DOI: ${project.link}` : ''}
`).join('\n') : 'No publications listed.'}

---

## Skills & Expertise

🔴 **Technical Skills:** ${data.skills.technical.join(', ')}
**Core Competencies:** ${data.skills.soft.join(', ')}
${data.skills.languages && data.skills.languages.length > 0 ? `**Languages:** ${data.skills.languages.join(', ')}` : ''}
`
  }
}

// RenderCV Template (Based on second screenshot - clean modern design)
export const renderCVTemplate: ResumeTemplate = {
  id: 'render-cv',
  name: 'RenderCV Style',
  description: 'Clean, modern CV template inspired by RenderCV with excellent typography',
  category: 'modern',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - CV</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Computer Modern', 'Latin Modern Roman', 'Times New Roman', serif; 
            line-height: 1.5; 
            color: #000; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.75in;
            background: white;
            font-size: 11pt;
        }
        
        .last-updated {
            text-align: right;
            font-size: 9pt;
            color: #666;
            font-style: italic;
            margin-bottom: 25px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 35px;
        }
        
        .name {
            font-size: 28pt;
            font-weight: normal;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }
        
        .contact-info {
            font-size: 11pt;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 8px;
        }
        
        .contact-info .separator {
            color: #666;
        }
        
        .contact-info a {
            color: #0066cc;
            text-decoration: none;
        }
        
        .contact-info a:hover {
            text-decoration: underline;
        }
        
        .welcome-section {
            margin-bottom: 30px;
            padding: 15px 0;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
        }
        
        .welcome-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000;
        }
        
        .welcome-text {
            font-size: 11pt;
            line-height: 1.6;
            text-align: justify;
            color: #333;
        }
        
        .quick-guide {
            margin-bottom: 25px;
            padding: 12px;
            background: #f9f9f9;
            border-left: 3px solid #0066cc;
        }
        
        .quick-guide-title {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 8px;
            color: #000;
        }
        
        .quick-guide-content {
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
        }
        
        .quick-guide-content ul {
            margin-left: 15px;
            margin-top: 5px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 15px;
            color: #000;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
        }
        
        .entry {
            margin-bottom: 18px;
        }
        
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .entry-title {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .entry-date {
            font-style: italic;
            font-size: 11pt;
            color: #333;
            white-space: nowrap;
        }
        
        .entry-subtitle {
            font-style: italic;
            font-size: 11pt;
            margin-bottom: 8px;
            color: #333;
        }
        
        .entry-description {
            font-size: 11pt;
            line-height: 1.4;
        }
        
        .entry-description ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        
        .entry-description li {
            margin-bottom: 4px;
            list-style-type: disc;
        }
        
        .gpa-link {
            color: #0066cc;
            text-decoration: none;
        }
        
        .gpa-link:hover {
            text-decoration: underline;
        }
        
        .coursework {
            margin-top: 5px;
        }
        
        .publications-section {
            margin-bottom: 25px;
        }
        
        .publication-item {
            margin-bottom: 12px;
            font-size: 11pt;
            line-height: 1.4;
        }
        
        .pub-title {
            font-style: italic;
            color: #0066cc;
        }
        
        .pub-authors {
            font-weight: normal;
        }
        
        .pub-journal {
            font-weight: bold;
        }
        
        .pub-doi {
            color: #0066cc;
            font-size: 10pt;
            margin-top: 2px;
        }
        
        .projects-section {
            margin-bottom: 25px;
        }
        
        .project-item {
            margin-bottom: 15px;
        }
        
        .project-title {
            font-weight: bold;
            font-size: 12pt;
            margin-bottom: 5px;
        }
        
        .project-link {
            color: #0066cc;
            text-decoration: none;
            font-size: 10pt;
        }
        
        .project-description {
            font-size: 11pt;
            line-height: 1.4;
            margin-bottom: 5px;
        }
        
        .page-footer {
            text-align: center;
            font-size: 10pt;
            color: #666;
            margin-top: 30px;
            font-style: italic;
        }
        
        @media print {
            body { 
                padding: 0.5in; 
                font-size: 10pt;
            }
            .section { margin-bottom: 20px; }
            .entry { margin-bottom: 15px; }
            .welcome-section { margin-bottom: 25px; }
        }
    </style>
</head>
<body>
    <div class="last-updated">Last updated in ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
    
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        <div class="contact-info">
            <span>📍 ${data.personalInfo.location}</span>
            <span class="separator">•</span>
            <span>📧 ${data.personalInfo.email}</span>
            <span class="separator">•</span>
            <span>📱 ${data.personalInfo.phone}</span>
            ${data.personalInfo.portfolio ? `<span class="separator">•</span><a href="${data.personalInfo.portfolio}">🌐 ${data.personalInfo.portfolio}</a>` : ''}
            ${data.personalInfo.linkedin ? `<span class="separator">•</span><a href="${data.personalInfo.linkedin}">💼 LinkedIn</a>` : ''}
        </div>
    </div>
    
    <div class="welcome-section">
        <div class="welcome-title">Welcome to RenderCV!</div>
        <div class="welcome-text">
            ${data.summary}
        </div>
    </div>
    
    <div class="quick-guide">
        <div class="quick-guide-title">Quick Guide</div>
        <div class="quick-guide-content">
            • Each section title is arbitrary and each section contains a list of entries.<br>
            • There are 7 unique entry types: <em>BulletEntry, TextEntry, EducationEntry, ExperienceEntry, NormalEntry, PublicationEntry, and OneLineEntry</em>.<br>
            • Select a section title, pick an entry type, and start writing your section!<br>
            • Then 🚀, you can find a comprehensive user guide for RenderCV.
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(edu => `
            <div class="entry">
                <div class="entry-header">
                    <div class="entry-title">${edu.school}</div>
                    <div class="entry-date">${edu.graduationDate}</div>
                </div>
                <div class="entry-subtitle">${edu.degree}</div>
                ${edu.gpa ? `<div class="coursework">GPA: <a href="#" class="gpa-link">${edu.gpa}</a> (a link to somewhere 🔗)</div>` : ''}
                ${edu.honors && edu.honors.length > 0 ? `<div class="coursework"><strong>Coursework:</strong> ${edu.honors.join(', ')}</div>` : ''}
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience.map(job => `
            <div class="entry">
                <div class="entry-header">
                    <div class="entry-title">${job.title}</div>
                    <div class="entry-date">${job.startDate} – ${job.endDate}</div>
                </div>
                <div class="entry-subtitle">${job.company}, ${job.location}</div>
                <div class="entry-description">
                    <ul>
                        ${job.description.map(item => `<li>${item}</li>`).join('')}
                        ${job.achievements.map(achievement => `<li><strong>Achievement:</strong> ${achievement}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('')}
    </div>
    
    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Publications</div>
        <div class="publications-section">
            ${data.projects.map(project => `
                <div class="publication-item">
                    <span class="pub-title">"${project.name}"</span><br>
                    <span class="pub-authors">${data.personalInfo.name}, Sample Author</span><br>
                    <span class="pub-journal">Journal of ${project.technologies[0] || 'Research'}</span>, vol. ${Math.floor(Math.random() * 50) + 1}, ${new Date().getFullYear()}.<br>
                    ${project.link ? `<div class="pub-doi">🔗 DOI: <a href="${project.link}">${project.link}</a></div>` : ''}
                </div>
            `).join('')}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Projects</div>
        <div class="projects-section">
            ${data.projects.map(project => `
                <div class="project-item">
                    <div class="project-title">
                        ${project.name}
                        ${project.link ? `<a href="${project.link}" class="project-link">🔗 ${project.link.replace('https://', '').replace('http://', '')}</a>` : ''}
                    </div>
                    <div class="project-description">${project.description}</div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}
    
    <div class="page-footer">
        ${data.personalInfo.name} - Page 1 of 2
    </div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `*Last updated in ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}*

# ${data.personalInfo.name}

📍 ${data.personalInfo.location} • 📧 ${data.personalInfo.email} • 📱 ${data.personalInfo.phone}
${data.personalInfo.portfolio ? `🌐 [${data.personalInfo.portfolio}](${data.personalInfo.portfolio}) • ` : ''}${data.personalInfo.linkedin ? `💼 [LinkedIn](${data.personalInfo.linkedin})` : ''}

---

## Welcome to RenderCV!

${data.summary}

### Quick Guide
• Each section title is arbitrary and each section contains a list of entries.
• There are 7 unique entry types: *BulletEntry, TextEntry, EducationEntry, ExperienceEntry, NormalEntry, PublicationEntry, and OneLineEntry*.
• Select a section title, pick an entry type, and start writing your section!
• Then 🚀, you can find a comprehensive user guide for RenderCV.

---

## Education

${data.education.map(edu => `
**${edu.school}** *${edu.graduationDate}*
${edu.degree}
${edu.gpa ? `GPA: [${edu.gpa}](#) (a link to somewhere 🔗)` : ''}
${edu.honors && edu.honors.length > 0 ? `**Coursework:** ${edu.honors.join(', ')}` : ''}
`).join('\n')}

---

## Experience

${data.experience.map(job => `
**${job.title}** *${job.startDate} – ${job.endDate}*
${job.company}, ${job.location}

${job.description.map(item => `• ${item}`).join('\n')}
${job.achievements.map(achievement => `• **Achievement:** ${achievement}`).join('\n')}
`).join('\n')}

${data.projects && data.projects.length > 0 ? `
---

## Publications

${data.projects.map(project => `
*"${project.name}"*
${data.personalInfo.name}, Sample Author
**Journal of ${project.technologies[0] || 'Research'}**, vol. ${Math.floor(Math.random() * 50) + 1}, ${new Date().getFullYear()}.
${project.link ? `🔗 DOI: [${project.link}](${project.link})` : ''}
`).join('\n')}

---

## Projects

${data.projects.map(project => `
**${project.name}** ${project.link ? `[🔗 ${project.link.replace('https://', '').replace('http://', '')}](${project.link})` : ''}
${project.description}
`).join('\n')}
` : ''}

---

*${data.personalInfo.name} - Page 1 of 2*
`
  }
}

// Academic Research Template (Based on the academic CV screenshot)
export const academicResearchTemplate: ResumeTemplate = {
  id: 'academic-research',
  name: 'Academic Research',
  description: 'Clean academic CV template with publication lists and research focus',
  category: 'classic',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Academic CV</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { 
            background: white;
            margin: 0;
            padding: 0;
        }
        body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.4; 
            color: #000; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.75in;
            background: white;
            font-size: 11pt;
        }
        
        .last-updated {
            text-align: right;
            font-size: 9pt;
            color: #666;
            font-style: italic;
            margin-bottom: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ccc;
        }
        
        .name {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .contact-info {
            font-size: 11pt;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .contact-info .separator {
            color: #666;
        }
        
        .contact-links {
            font-size: 11pt;
            color: #0066cc;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .contact-links a {
            color: #0066cc;
            text-decoration: none;
        }
        
        .welcome-section {
            margin-bottom: 25px;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #0066cc;
        }
        
        .welcome-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
            color: #0066cc;
        }
        
        .welcome-text {
            font-size: 11pt;
            line-height: 1.5;
            text-align: justify;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 12px;
            color: #000;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
        }
        
        .education-item {
            margin-bottom: 15px;
        }
        
        .education-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .degree {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .date-range {
            font-style: italic;
            font-size: 11pt;
            color: #333;
        }
        
        .school {
            font-style: italic;
            font-size: 11pt;
            margin-bottom: 5px;
        }
        
        .education-details {
            font-size: 11pt;
            margin-left: 20px;
        }
        
        .education-details li {
            margin-bottom: 3px;
            list-style-type: disc;
        }
        
        .experience-item {
            margin-bottom: 18px;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .job-title {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .job-location {
            font-style: italic;
            font-size: 11pt;
            color: #333;
        }
        
        .company-date {
            font-style: italic;
            font-size: 11pt;
            color: #333;
            margin-bottom: 8px;
        }
        
        .job-description {
            margin-left: 20px;
            padding-left: 0;
        }
        
        .job-description li {
            margin-bottom: 4px;
            list-style-type: disc;
            font-size: 11pt;
            line-height: 1.3;
        }
        
        .publications-section {
            margin-bottom: 20px;
        }
        
        .publication-category {
            margin-bottom: 15px;
        }
        
        .publication-category h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 8px;
            color: #0066cc;
        }
        
        .publication-item {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        
        .publication-item::before {
            content: counter(publication-counter);
            counter-increment: publication-counter;
            position: absolute;
            left: 0;
            top: 0;
            background: #0066cc;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8pt;
            font-weight: bold;
        }
        
        .publication-text {
            font-size: 10pt;
            line-height: 1.4;
        }
        
        .publication-text .authors {
            font-weight: normal;
        }
        
        .publication-text .title {
            font-style: italic;
            color: #333;
        }
        
        .publication-text .journal {
            font-weight: bold;
        }
        
        .publication-text .details {
            color: #666;
        }
        
        .projects-section {
            margin-bottom: 20px;
        }
        
        .project-item {
            margin-bottom: 12px;
            padding-left: 15px;
            border-left: 2px solid #0066cc;
        }
        
        .project-title {
            font-weight: bold;
            font-size: 11pt;
            margin-bottom: 3px;
        }
        
        .project-description {
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
        }
        
        .page-number {
            text-align: center;
            font-size: 10pt;
            color: #666;
            margin-top: 30px;
            font-style: italic;
        }
        
        @media print {
            html {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            body { 
                background: white !important; 
                color: #000 !important; 
                padding: 0.5in !important;
            }
            .page-number { 
                position: fixed; 
                bottom: 0.3in; 
                left: 50%; 
                transform: translateX(-50%); 
            }
        }
    </style>
</head>
<body>
    <div class="last-updated">Last updated in ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
    
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        <div class="contact-info">
            <span>📍 ${data.personalInfo.location}</span>
            <span class="separator">✉</span>
            <span>${data.personalInfo.email}</span>
            <span class="separator">📱</span>
            <span>${data.personalInfo.phone}</span>
        </div>
        <div class="contact-links">
            ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}">💼 LinkedIn</a>` : ''}
            ${data.personalInfo.github ? `<a href="${data.personalInfo.github}">🔗 GitHub</a>` : ''}
            ${data.personalInfo.portfolio ? `<a href="${data.personalInfo.portfolio}">🌐 Portfolio</a>` : ''}
        </div>
    </div>

    <div class="welcome-section">
        <div class="welcome-title">Welcome to My Academic Profile!</div>
        <div class="welcome-text">
            ${data.summary}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <div class="degree">${edu.school}</div>
                    <div class="date-range">${edu.graduationDate}</div>
                </div>
                <div class="school">${edu.degree}</div>
                ${edu.gpa || edu.honors ? `
                <ul class="education-details">
                    ${edu.gpa ? `<li><strong>GPA:</strong> ${edu.gpa}</li>` : ''}
                    ${edu.honors && edu.honors.length > 0 ? `<li><strong>Coursework:</strong> ${edu.honors.join(', ')}</li>` : ''}
                </ul>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience.map(job => `
            <div class="experience-item">
                <div class="job-header">
                    <div class="job-title">${job.title}</div>
                    <div class="job-location">${job.location}</div>
                </div>
                <div class="company-date">${job.company} ${job.startDate} – ${job.endDate}</div>
                <ul class="job-description">
                    ${job.description.map(item => `<li>${item}</li>`).join('')}
                    ${job.achievements.map(achievement => `<li><strong>Achievement:</strong> ${achievement}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        <div class="projects-section">
            ${data.projects.map(project => `
                <div class="project-item">
                    <div class="project-title">${project.name} ${project.link ? `<a href="${project.link}" style="color: #0066cc;">🔗</a>` : ''}</div>
                    <div class="project-description">
                        ${project.description}
                        <br><strong>Technologies:</strong> ${project.technologies.join(', ')}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="page-number">${data.personalInfo.name} - Page 1 of 2</div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `# ${data.personalInfo.name}

*Last updated in ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}*

📍 ${data.personalInfo.location} ✉ ${data.personalInfo.email} 📱 ${data.personalInfo.phone}
${data.personalInfo.linkedin ? `💼 [LinkedIn](${data.personalInfo.linkedin})` : ''} ${data.personalInfo.github ? `🔗 [GitHub](${data.personalInfo.github})` : ''}

---

## Welcome to My Academic Profile!

${data.summary}

---

## Education

${data.education.map(edu => `
**${edu.school}** *${edu.graduationDate}*
${edu.degree}
${edu.gpa ? `• **GPA:** ${edu.gpa}` : ''}
${edu.honors && edu.honors.length > 0 ? `• **Coursework:** ${edu.honors.join(', ')}` : ''}
`).join('\n')}

---

## Experience

${data.experience.map(job => `
**${job.title}** *${job.location}*
${job.company} ${job.startDate} – ${job.endDate}

${job.description.map(item => `• ${item}`).join('\n')}
${job.achievements.map(achievement => `• **Achievement:** ${achievement}`).join('\n')}
`).join('\n')}

${data.projects && data.projects.length > 0 ? `
---

## Projects

${data.projects.map(project => `
**${project.name}** ${project.link ? `[🔗](${project.link})` : ''}
${project.description}
**Technologies:** ${project.technologies.join(', ')}
`).join('\n')}
` : ''}

---

*${data.personalInfo.name} - Page 1 of 2*
`
  }
}

// All available templates
export const allTemplates: ResumeTemplate[] = [
  yourResumeTemplate,
  modernTechTemplate,
  executiveLeadershipTemplate,
  modernProfessionalTemplate,
  academicCVTemplate,
  renderCVTemplate,
  academicResearchTemplate
]

// Helper functions
export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return allTemplates.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string): ResumeTemplate[] => {
  return allTemplates.filter(template => template.category === category)
}

export const optimizeResumeForJob = (
  resumeData: ResumeData, 
  jobDescription: string, 
  templateId: string = 'your-resume-style'
): { optimizedData: ResumeData; suggestions: string[] } => {
  // Check HTML templates
  const htmlTemplate = getTemplateById(templateId)
  
  // If template not found, throw error
  if (!htmlTemplate) {
    throw new Error(`Template with id ${templateId} not found`)
  }

  // Extract keywords from job description
  const jobKeywords = extractJobKeywords(jobDescription)
  
  // Create optimized version
  const optimizedData = { ...resumeData }
  const suggestions: string[] = []

  // Add relevant keywords to skills if missing
  jobKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase()
    const hasKeyword = resumeData.skills.technical.some(skill => 
      skill.toLowerCase().includes(keywordLower)
    ) || resumeData.skills.soft.some(skill => 
      skill.toLowerCase().includes(keywordLower)
    )

    if (!hasKeyword) {
      suggestions.push(`Consider adding "${keyword}" to your skills if you have experience with it`)
    }
  })

  return { optimizedData, suggestions }
}

const extractJobKeywords = (jobDescription: string): string[] => {
  const commonTechKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'Agile', 'Scrum', 'Machine Learning', 'AI', 'Data Science',
    'TypeScript', 'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL'
  ]

  return commonTechKeywords.filter(keyword => 
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  )
} 