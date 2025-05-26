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

// Modern ATS-Optimized Template
export const modernTemplate: ResumeTemplate = {
  id: 'modern-ats',
  name: 'Modern ATS-Optimized',
  description: 'Clean, professional design optimized for ATS systems',
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
            font-family: 'Arial', 'Helvetica', sans-serif; 
            line-height: 1.5; 
            color: #333333; 
            padding: 20px;
            background: white;
            font-size: 11px;
        }
        .resume-container {
            background: white;
            max-width: 800px;
            margin: 0 auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
            background: #2c3e50;
            color: white;
            text-align: center; 
            padding: 25px 20px;
        }
        .name { 
            font-size: 28px; 
            font-weight: 300; 
            margin-bottom: 4px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .title { 
            font-size: 12px; 
            opacity: 0.9; 
            margin-bottom: 15px;
            font-weight: 400;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .contact { 
            font-size: 10px; 
            opacity: 0.9;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        .contact a { 
            color: #bdc3c7; 
            text-decoration: none;
        }
        .contact a:hover { color: white; }
        .content { 
            padding: 30px;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        .left-column {
            border-right: 1px solid #ecf0f1;
            padding-right: 25px;
        }
        .right-column {
            padding-left: 5px;
        }
        .section { margin-bottom: 25px; }
        .section-title { 
            font-size: 12px; 
            font-weight: 600; 
            color: #2c3e50; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 5px;
        }
        .summary { 
            font-size: 11px; 
            line-height: 1.6; 
            color: #555555; 
            text-align: justify;
            margin-bottom: 20px;
        }
        .job { 
            margin-bottom: 20px; 
            padding-bottom: 15px;
            border-bottom: 1px solid #f8f9fa;
        }
        .job:last-child { border-bottom: none; }
        .job-title { 
            font-weight: 600; 
            font-size: 12px; 
            color: #2c3e50;
            margin-bottom: 2px;
        }
        .company { 
            font-weight: 500; 
            color: #7f8c8d; 
            font-size: 11px;
            margin-bottom: 2px;
        }
        .date-location { 
            font-size: 10px; 
            color: #95a5a6; 
            margin-bottom: 8px;
            font-style: italic;
        }
        .description { 
            margin-left: 0; 
            font-size: 10px; 
            color: #555555;
        }
        .description li { 
            margin-bottom: 4px; 
            position: relative;
            padding-left: 12px;
        }
        .description li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #7f8c8d;
        }
        .skills-list { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 8px; 
            margin-bottom: 15px;
        }
        .skill-item { 
            background: #f8f9fa; 
            padding: 4px 8px; 
            border-radius: 3px; 
            font-size: 9px; 
            color: #555555;
            border: 1px solid #ecf0f1;
        }
        .education-item {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f8f9fa;
        }
        .education-item:last-child { border-bottom: none; }
        .degree { 
            font-weight: 600; 
            font-size: 11px; 
            color: #2c3e50;
            margin-bottom: 2px;
        }
        .school { 
            color: #7f8c8d; 
            font-size: 10px; 
            margin-bottom: 2px;
        }
        .edu-details {
            font-size: 9px;
            color: #95a5a6;
        }
        .contact-info {
            margin-bottom: 20px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 10px;
            color: #555555;
        }
        .contact-icon {
            width: 12px;
            margin-right: 8px;
            color: #7f8c8d;
        }
        @media print {
            body { padding: 0.3in; font-size: 10px; }
            .name { font-size: 24px; }
            .section-title { font-size: 11px; }
            .content { gap: 20px; padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="header">
            <div class="name">${data.personalInfo.name}</div>
            <div class="title">${data.personalInfo.jobTitle}</div>
            <div class="contact">
                <span>${data.personalInfo.email}</span>
                <span>${data.personalInfo.phone}</span>
                <span>${data.personalInfo.location}</span>
                ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}">LinkedIn</a>` : ''}
                ${data.personalInfo.portfolio ? `<a href="${data.personalInfo.portfolio}">Portfolio</a>` : ''}
            </div>
        </div>

        <div class="content">
            <div class="left-column">
                <div class="section">
                    <div class="section-title">Contact</div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-icon">📧</span>
                            <span>${data.personalInfo.email}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📱</span>
                            <span>${data.personalInfo.phone}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📍</span>
                            <span>${data.personalInfo.location}</span>
                        </div>
                        ${data.personalInfo.linkedin ? `
                        <div class="contact-item">
                            <span class="contact-icon">🔗</span>
                            <a href="${data.personalInfo.linkedin}" style="color: #555555;">LinkedIn Profile</a>
                        </div>
                        ` : ''}
                        ${data.personalInfo.portfolio ? `
                        <div class="contact-item">
                            <span class="contact-icon">🌐</span>
                            <a href="${data.personalInfo.portfolio}" style="color: #555555;">Portfolio</a>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Skills</div>
                    ${data.skills.technical.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: 600; font-size: 10px; color: #2c3e50; margin-bottom: 6px;">Technical</div>
                        <div class="skills-list">
                            ${data.skills.technical.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                    ${data.skills.soft.length > 0 ? `
                    <div>
                        <div style="font-weight: 600; font-size: 10px; color: #2c3e50; margin-bottom: 6px;">Core Competencies</div>
                        <div class="skills-list">
                            ${data.skills.soft.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                    ${data.skills.certifications && data.skills.certifications.length > 0 ? `
                    <div style="margin-top: 15px;">
                        <div style="font-weight: 600; font-size: 10px; color: #2c3e50; margin-bottom: 6px;">Certifications</div>
                        <div class="skills-list">
                            ${data.skills.certifications.map(cert => `<span class="skill-item">${cert}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>

                <div class="section">
                    <div class="section-title">Education</div>
                    ${data.education.map(edu => `
                        <div class="education-item">
                            <div class="degree">${edu.degree}</div>
                            <div class="school">${edu.school}</div>
                            <div class="edu-details">${edu.location} • ${edu.graduationDate}</div>
                            ${edu.gpa ? `<div class="edu-details">GPA: ${edu.gpa}</div>` : ''}
                            ${edu.honors && edu.honors.length > 0 ? `<div class="edu-details">${edu.honors.join(', ')}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="right-column">
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <div class="summary">${data.summary}</div>
                </div>

                <div class="section">
                    <div class="section-title">Professional Experience</div>
                    ${data.experience.map(job => `
                        <div class="job">
                            <div class="job-title">${job.title}</div>
                            <div class="company">${job.company}</div>
                            <div class="date-location">${job.startDate} - ${job.endDate} • ${job.location}</div>
                            <ul class="description">
                                ${job.description.map(item => `<li>${item}</li>`).join('')}
                                ${job.achievements.map(achievement => `<li><strong>Achievement:</strong> ${achievement}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>

                ${data.projects && data.projects.length > 0 && data.projects.some(p => p.name) ? `
                <div class="section">
                    <div class="section-title">Notable Projects</div>
                    ${data.projects.filter(p => p.name).map(project => `
                        <div style="margin-bottom: 15px;">
                            <div style="font-weight: 600; font-size: 11px; color: #2c3e50; margin-bottom: 3px;">
                                ${project.name} ${project.link ? `<a href="${project.link}" style="color: #7f8c8d; font-size: 9px;">[Link]</a>` : ''}
                            </div>
                            <div style="font-size: 10px; color: #555555; margin-bottom: 4px;">${project.description}</div>
                            ${project.technologies.length > 0 ? `
                            <div style="font-size: 9px; color: #7f8c8d;">
                                <strong>Technologies:</strong> ${project.technologies.join(', ')}
                            </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    </div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return `# ${data.personalInfo.name}

**Contact:** ${data.personalInfo.email} • ${data.personalInfo.phone} • ${data.personalInfo.location}
${data.personalInfo.linkedin ? `**LinkedIn:** ${data.personalInfo.linkedin}` : ''}
${data.personalInfo.portfolio ? `**Portfolio:** ${data.personalInfo.portfolio}` : ''}
${data.personalInfo.github ? `**GitHub:** ${data.personalInfo.github}` : ''}

## Professional Summary

${data.summary}

## Professional Experience

${data.experience.map(job => `
### ${job.title} | ${job.company}
**${job.startDate} - ${job.endDate}** • ${job.location}

${job.description.map(item => `- ${item}`).join('\n')}
${job.achievements.map(achievement => `- **Achievement:** ${achievement}`).join('\n')}
`).join('\n')}

## Skills

**Technical Skills:** ${data.skills.technical.join(' • ')}

**Core Competencies:** ${data.skills.soft.join(' • ')}

${data.skills.certifications && data.skills.certifications.length > 0 ? `**Certifications:** ${data.skills.certifications.join(' • ')}` : ''}

## Education

${data.education.map(edu => `
**${edu.degree}**
${edu.school}, ${edu.location} • ${edu.graduationDate}
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
${edu.honors ? `Honors: ${edu.honors.join(', ')}` : ''}
`).join('\n')}

${data.projects && data.projects.length > 0 ? `
## Key Projects

${data.projects.map(project => `
### ${project.name}
${project.description}
**Technologies:** ${project.technologies.join(', ')}
${project.link ? `**Link:** ${project.link}` : ''}
`).join('\n')}
` : ''}
`
  }
}

// Tech-Focused Template
export const techTemplate: ResumeTemplate = {
  id: 'tech-focused',
  name: 'Tech-Focused',
  description: 'Optimized for software engineering and technical roles',
  category: 'tech',
  atsOptimized: true,
  
  generateHTML: (data: ResumeData, jobDescription?: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Software Engineer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Consolas', 'Monaco', monospace; 
            line-height: 1.6; 
            color: #2d3748; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.5in;
            background: #f7fafc;
        }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { margin-bottom: 30px; }
        .name { 
            font-size: 32px; 
            font-weight: bold; 
            color: #1a202c; 
            margin-bottom: 8px;
            font-family: 'Arial', sans-serif;
        }
        .title { font-size: 18px; color: #4a5568; margin-bottom: 15px; }
        .contact { font-size: 14px; color: #718096; }
        .contact a { color: #3182ce; text-decoration: none; }
        .section { margin-bottom: 30px; }
        .section-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #2d3748; 
            margin-bottom: 15px;
            font-family: 'Arial', sans-serif;
            position: relative;
        }
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50px;
            height: 3px;
            background: #3182ce;
        }
        .tech-skills { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 20px;
        }
        .skill-group h4 { 
            color: #2d3748; 
            margin-bottom: 10px; 
            font-size: 16px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }
        .skill-items { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill-tag { 
            background: #edf2f7; 
            color: #2d3748; 
            padding: 4px 10px; 
            border-radius: 4px; 
            font-size: 12px;
            border: 1px solid #cbd5e0;
            font-family: 'Consolas', monospace;
        }
        .job { 
            margin-bottom: 25px; 
            padding: 20px;
            border-left: 4px solid #3182ce;
            background: #f7fafc;
        }
        .job-header { margin-bottom: 10px; }
        .job-title { font-size: 18px; font-weight: bold; color: #1a202c; }
        .company { font-size: 16px; color: #4a5568; font-weight: 600; }
        .job-meta { font-size: 14px; color: #718096; margin-top: 5px; }
        .achievements { margin-top: 10px; }
        .achievements li { 
            margin-bottom: 8px; 
            color: #2d3748;
            position: relative;
            padding-left: 20px;
        }
        .achievements li::before {
            content: '▶';
            position: absolute;
            left: 0;
            color: #3182ce;
        }
        .project { 
            background: #f7fafc; 
            padding: 15px; 
            border-radius: 6px; 
            margin-bottom: 15px;
            border-left: 3px solid #38b2ac;
        }
        .project-name { font-weight: bold; color: #1a202c; margin-bottom: 5px; }
        .project-tech { margin-top: 8px; }
        @media print {
            body { background: white; }
            .container { box-shadow: none; padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="name">${data.personalInfo.name}</div>
            <div class="title">Software Engineer</div>
            <div class="contact">
                📧 ${data.personalInfo.email} • 📱 ${data.personalInfo.phone} • 📍 ${data.personalInfo.location}
                ${data.personalInfo.github ? ` • <a href="${data.personalInfo.github}">GitHub</a>` : ''}
                ${data.personalInfo.linkedin ? ` • <a href="${data.personalInfo.linkedin}">LinkedIn</a>` : ''}
                ${data.personalInfo.portfolio ? ` • <a href="${data.personalInfo.portfolio}">Portfolio</a>` : ''}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="tech-skills">
                <div class="skill-group">
                    <h4>Programming Languages</h4>
                    <div class="skill-items">
                        ${data.skills.technical.filter(skill => 
                            ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'].some(lang => 
                                skill.toLowerCase().includes(lang.toLowerCase())
                            )
                        ).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="skill-group">
                    <h4>Frameworks & Libraries</h4>
                    <div class="skill-items">
                        ${data.skills.technical.filter(skill => 
                            ['React', 'Vue', 'Angular', 'Node', 'Express', 'Django', 'Flask', 'Spring', 'Laravel'].some(framework => 
                                skill.toLowerCase().includes(framework.toLowerCase())
                            )
                        ).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="skill-group">
                    <h4>Tools & Technologies</h4>
                    <div class="skill-items">
                        ${data.skills.technical.filter(skill => 
                            !['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'React', 'Vue', 'Angular', 'Node', 'Express', 'Django', 'Flask', 'Spring', 'Laravel'].some(excluded => 
                                skill.toLowerCase().includes(excluded.toLowerCase())
                            )
                        ).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Experience</div>
            ${data.experience.map(job => `
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">${job.title}</div>
                        <div class="company">${job.company}</div>
                        <div class="job-meta">${job.startDate} - ${job.endDate} • ${job.location}</div>
                    </div>
                    <ul class="achievements">
                        ${job.description.map(item => `<li>${item}</li>`).join('')}
                        ${job.achievements.map(achievement => `<li><strong>Impact:</strong> ${achievement}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        ${data.projects && data.projects.length > 0 ? `
        <div class="section">
            <div class="section-title">Featured Projects</div>
            ${data.projects.map(project => `
                <div class="project">
                    <div class="project-name">${project.name} ${project.link ? `<a href="${project.link}" style="color: #3182ce;">🔗</a>` : ''}</div>
                    <div>${project.description}</div>
                    <div class="project-tech">
                        <strong>Tech Stack:</strong> 
                        ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join(' ')}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">Education</div>
            ${data.education.map(edu => `
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #1a202c;">${edu.degree}</div>
                    <div style="color: #4a5568;">${edu.school}, ${edu.location}</div>
                    <div style="color: #718096; font-size: 14px;">${edu.graduationDate} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return modernTemplate.generateMarkdown(data, jobDescription)
  }
}

// Executive Template
export const executiveTemplate: ResumeTemplate = {
  id: 'executive',
  name: 'Executive Leadership',
  description: 'Professional template for senior leadership roles',
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
        body { 
            font-family: 'Georgia', serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.5in;
            background: white;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding: 30px 0;
            border-top: 3px solid #34495e;
            border-bottom: 1px solid #bdc3c7;
        }
        .name { 
            font-size: 36px; 
            font-weight: normal; 
            color: #2c3e50; 
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .executive-title { 
            font-size: 18px; 
            color: #7f8c8d; 
            margin-bottom: 20px;
            font-style: italic;
        }
        .contact { font-size: 14px; color: #7f8c8d; }
        .contact a { color: #3498db; text-decoration: none; }
        .section { margin-bottom: 35px; }
        .section-title { 
            font-size: 22px; 
            font-weight: normal; 
            color: #2c3e50; 
            margin-bottom: 20px;
            text-align: center;
            position: relative;
        }
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 1px;
            background: #34495e;
        }
        .executive-summary { 
            font-size: 16px; 
            line-height: 1.8; 
            text-align: justify;
            font-style: italic;
            color: #34495e;
            padding: 0 20px;
        }
        .job { 
            margin-bottom: 30px; 
            padding-bottom: 25px;
            border-bottom: 1px solid #ecf0f1;
        }
        .job:last-child { border-bottom: none; }
        .job-header { margin-bottom: 15px; }
        .job-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #2c3e50; 
            margin-bottom: 5px;
        }
        .company { 
            font-size: 16px; 
            color: #7f8c8d; 
            font-weight: normal;
            margin-bottom: 5px;
        }
        .job-meta { 
            font-size: 14px; 
            color: #95a5a6; 
            font-style: italic;
        }
        .achievements { margin-top: 15px; }
        .achievements li { 
            margin-bottom: 10px; 
            color: #34495e;
            font-size: 15px;
        }
        .key-accomplishments {
            background: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #3498db;
            margin: 20px 0;
        }
        .key-accomplishments h4 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .skills-executive {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        .skill-category h4 {
            color: #2c3e50;
            margin-bottom: 12px;
            font-size: 16px;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
        }
        .skill-list {
            color: #34495e;
            font-size: 14px;
            line-height: 1.8;
        }
        @media print {
            .name { font-size: 30px; }
            .section-title { font-size: 18px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.personalInfo.name}</div>
        <div class="executive-title">Senior Executive Leader</div>
        <div class="contact">
            ${data.personalInfo.email} • ${data.personalInfo.phone} • ${data.personalInfo.location}
            ${data.personalInfo.linkedin ? ` • <a href="${data.personalInfo.linkedin}">LinkedIn Profile</a>` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="executive-summary">${data.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">Leadership Experience</div>
        ${data.experience.map(job => `
            <div class="job">
                <div class="job-header">
                    <div class="job-title">${job.title}</div>
                    <div class="company">${job.company}</div>
                    <div class="job-meta">${job.startDate} - ${job.endDate} • ${job.location}</div>
                </div>
                <ul class="achievements">
                    ${job.description.map(item => `<li>${item}</li>`).join('')}
                </ul>
                ${job.achievements.length > 0 ? `
                <div class="key-accomplishments">
                    <h4>Key Accomplishments</h4>
                    <ul>
                        ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Core Competencies</div>
        <div class="skills-executive">
            <div class="skill-category">
                <h4>Leadership & Strategy</h4>
                <div class="skill-list">
                    ${data.skills.soft.join(' • ')}
                </div>
            </div>
            <div class="skill-category">
                <h4>Technical Expertise</h4>
                <div class="skill-list">
                    ${data.skills.technical.join(' • ')}
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Education & Credentials</div>
        ${data.education.map(edu => `
            <div style="margin-bottom: 20px;">
                <div style="font-weight: bold; color: #2c3e50; font-size: 16px;">${edu.degree}</div>
                <div style="color: #7f8c8d; margin-top: 5px;">${edu.school}, ${edu.location} • ${edu.graduationDate}</div>
                ${edu.honors ? `<div style="color: #34495e; font-style: italic; margin-top: 5px;">${edu.honors.join(', ')}</div>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>
    `
  },

  generateMarkdown: (data: ResumeData, jobDescription?: string) => {
    return modernTemplate.generateMarkdown(data, jobDescription)
  }
}

// Template registry
export const resumeTemplates: ResumeTemplate[] = [
  modernTemplate,
  techTemplate,
  executiveTemplate
]

export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return resumeTemplates.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string): ResumeTemplate[] => {
  return resumeTemplates.filter(template => template.category === category)
}

// Template optimization based on job description
export const optimizeResumeForJob = (
  resumeData: ResumeData, 
  jobDescription: string, 
  templateId: string = 'modern-ats'
): { optimizedData: ResumeData; suggestions: string[] } => {
  const template = getTemplateById(templateId)
  if (!template) {
    throw new Error(`Template ${templateId} not found`)
  }

  // Extract keywords from job description
  const jobKeywords = extractJobKeywords(jobDescription)
  
  // Optimize resume data
  const optimizedData = { ...resumeData }
  const suggestions: string[] = []

  // Optimize skills section
  const missingSkills = jobKeywords.filter(keyword => 
    !resumeData.skills.technical.some(skill => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    ) && 
    !resumeData.skills.soft.some(skill => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    )
  )

  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding these relevant skills: ${missingSkills.slice(0, 5).join(', ')}`)
  }

  // Optimize summary for job keywords
  const summaryKeywordCount = jobKeywords.filter(keyword =>
    resumeData.summary.toLowerCase().includes(keyword.toLowerCase())
  ).length

  if (summaryKeywordCount < 3) {
    suggestions.push('Consider incorporating more job-relevant keywords in your professional summary')
  }

  return { optimizedData, suggestions }
}

// Helper function to extract keywords from job description
const extractJobKeywords = (jobDescription: string): string[] => {
  const commonKeywords = [
    // Technical skills
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'Agile', 'Scrum', 'REST', 'API', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'Microservices',
    
    // Soft skills
    'Leadership', 'Communication', 'Problem-solving', 'Team management', 'Project management', 'Strategic planning',
    'Collaboration', 'Innovation', 'Analytical', 'Decision-making', 'Mentoring', 'Cross-functional',
    
    // Business terms
    'Revenue', 'Growth', 'Optimization', 'Efficiency', 'ROI', 'KPI', 'Metrics', 'Analytics', 'Strategy',
    'Operations', 'Process improvement', 'Customer experience', 'Stakeholder management'
  ]

  return commonKeywords.filter(keyword =>
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  )
} 