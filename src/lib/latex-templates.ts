import { ResumeData } from './resume-templates'

export interface LaTeXTemplate {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'tech' | 'creative' | 'executive'
  atsOptimized: boolean
  previewImage: string
  overleafUrl?: string
  generateLaTeX: (data: ResumeData) => string
}

// AltaCV Template - Modern, clean design
export const altaCVTemplate: LaTeXTemplate = {
  id: 'altacv',
  name: 'AltaCV Professional',
  description: 'Modern CV template based on Marissa Mayer\'s design - clean and professional',
  category: 'modern',
  atsOptimized: true,
  previewImage: '/images/latex-previews/altacv-preview.png',
  overleafUrl: 'https://www.overleaf.com/latex/templates/altacv-template/trgqjpwnmtgv',
  generateLaTeX: (data: ResumeData) => {
    const escapeLatex = (text: string): string => {
      return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\$/g, '\\$')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/#/g, '\\#')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde{}')
    }

    return `%%%%%%%%%%%%%%%%%
% This is an sample CV template created using altacv.cls
% (v1.7.2, 28 August 2024) written by LianTze Lim (liantze@gmail.com). Compiles with pdfLaTeX, XeLaTeX and LuaLaTeX.
%
%% It may be distributed and/or modified under the
%% conditions of the LaTeX Project Public License, either version 1.3
%% of this license or (at your option) any later version.
%% The latest version of this license is in
%%    http://www.latex-project.org/lppl.txt
%% and version 1.3 or later is part of all distributions of LaTeX
%% version 2003/12/01 or later.
%%%%%%%%%%%%%%%%

\\documentclass[10pt,a4paper,ragged2e,withhyper]{altacv}

% Change the page layout if you need to
\\geometry{left=1.25cm,right=1.25cm,top=1.5cm,bottom=1.5cm,columnsep=1.2cm}

% The paracol package lets you typeset columns of text in parallel
\\usepackage{paracol}

% Change the font if you want to, depending on whether
% you're using pdflatex or xelatex/lualatex
\\iftutex 
  % If using xelatex or lualatex:
  \\setmainfont{Roboto Slab}
  \\setsansfont{Lato}
  \\renewcommand{\\familydefault}{\\sfdefault}
\\else
  % If using pdflatex:
  \\usepackage[rm]{roboto}
  \\usepackage[defaultsans]{lato}
  \\renewcommand{\\familydefault}{\\sfdefault}
\\fi

% Change the colours if you want to
\\definecolor{SlateGrey}{HTML}{2E2E2E}
\\definecolor{LightGrey}{HTML}{666666}
\\definecolor{DarkPastelRed}{HTML}{450808}
\\definecolor{PastelRed}{HTML}{8F0D0D}
\\definecolor{GoldenEarth}{HTML}{E7D192}
\\colorlet{name}{black}
\\colorlet{tagline}{PastelRed}
\\colorlet{heading}{DarkPastelRed}
\\colorlet{headingrule}{GoldenEarth}
\\colorlet{subheading}{PastelRed}
\\colorlet{accent}{PastelRed}
\\colorlet{emphasis}{SlateGrey}
\\colorlet{body}{LightGrey}

% Change some fonts, if necessary
\\renewcommand{\\namefont}{\\Huge\\rmfamily\\bfseries}
\\renewcommand{\\personalinfofont}{\\footnotesize}
\\renewcommand{\\cvsectionfont}{\\LARGE\\rmfamily\\bfseries}
\\renewcommand{\\cvsubsectionfont}{\\large\\bfseries}

% Change the bullets for itemize and rating marker
\\renewcommand{\\cvItemMarker}{{\\small\\textbullet}}
\\renewcommand{\\cvRatingMarker}{\\faCircle}

\\begin{document}
\\name{${escapeLatex(data.personalInfo.name || 'Your Name Here')}}
\\tagline{${escapeLatex(data.personalInfo.jobTitle || 'Your Position or Tagline Here')}}

\\personalinfo{%
  \\email{${escapeLatex(data.personalInfo.email || 'your_name@email.com')}}
  \\phone{${escapeLatex(data.personalInfo.phone || '000-00-0000')}}
  \\location{${escapeLatex(data.personalInfo.location || 'Location, COUNTRY')}}
  ${data.personalInfo.linkedin ? `\\linkedin{${escapeLatex(data.personalInfo.linkedin)}}` : ''}
  ${data.personalInfo.github ? `\\github{${escapeLatex(data.personalInfo.github)}}` : ''}
  ${data.personalInfo.portfolio ? `\\homepage{${escapeLatex(data.personalInfo.portfolio)}}` : ''}
}

\\makecvheader

%% Set the left/right column width ratio to 6:4.
\\columnratio{0.6}

% Start a 2-column paracol. Both the left and right columns will automatically
% break across pages if things get too long.
\\begin{paracol}{2}
\\cvsection{Experience}

${data.experience.map(exp => `
\\cvevent{${escapeLatex(exp.title || 'Job Title')}}{${escapeLatex(exp.company || 'Company')}}{${escapeLatex(exp.startDate || 'Start')} -- ${escapeLatex(exp.endDate || 'End')}}{${escapeLatex(exp.location || 'Location')}}
\\begin{itemize}
${exp.description.map(desc => `\\item ${escapeLatex(desc)}`).join('\n')}
${exp.achievements?.map(ach => `\\item ${escapeLatex(ach)}`).join('\n') || ''}
\\end{itemize}

\\divider
`).join('')}

${data.projects && data.projects.length > 0 ? `
\\cvsection{Projects}

${data.projects.map(project => `
\\cvevent{${escapeLatex(project.name || 'Project Name')}}{${escapeLatex(project.technologies?.join(', ') || 'Technologies')}}{}{}
${escapeLatex(project.description || 'Project description')}

\\divider
`).join('')}
` : ''}

%% Switch to the right column. This will now automatically move to the second
%% page if the content is too long.
\\switchcolumn

${data.summary ? `
\\cvsection{Professional Summary}

\\begin{quote}
\`\`${escapeLatex(data.summary)}\'\'
\\end{quote}
` : ''}

\\cvsection{Strengths}

${data.skills.technical.length > 0 ? `
{\\LaTeXraggedright
${data.skills.technical.slice(0, 6).map(skill => `\\cvtag{${escapeLatex(skill)}}`).join('\n')}
\\par}

\\divider\\smallskip
` : ''}

${data.skills.soft.length > 0 ? `
${data.skills.soft.slice(0, 4).map(skill => `\\cvtag{${escapeLatex(skill)}}`).join('\\\\\n')}
` : ''}

\\cvsection{Education}

${data.education.map(edu => `
\\cvevent{${escapeLatex(edu.degree || 'Degree')}}{${escapeLatex(edu.school || 'School')}}{${escapeLatex(edu.graduationDate || 'Graduation Date')}}{}
${edu.honors && edu.honors.length > 0 ? escapeLatex(edu.honors.join(', ')) : ''}

\\divider
`).join('')}

\\end{paracol}

\\end{document}`
  }
}

// Simple Hipster CV Template - Modern with subtle colors
export const simpleHipsterTemplate: LaTeXTemplate = {
  id: 'simple-hipster',
  name: 'Simple Hipster CV',
  description: 'Modern template with clean design and subtle color accents',
  category: 'modern',
  atsOptimized: true,
  previewImage: '/images/latex-previews/simple-hipster-preview.png',
  overleafUrl: 'https://www.overleaf.com/latex/templates/simple-hipster-cv/qjbqvpqrqjqr',
  generateLaTeX: (data: ResumeData) => {
    const escapeLatex = (text: string): string => {
      return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\$/g, '\\$')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/#/g, '\\#')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde{}')
    }

    const fullName = data.personalInfo.name || 'Your Name'
    const nameParts = fullName.split(' ')
    const firstName = nameParts[0] || 'First'
    const lastName = nameParts.slice(1).join(' ') || 'Last'

    return `% a mashup of hipstercv, friggeri and twenty cv
% https://www.latextemplates.com/template/twenty-seconds-resumecv
% https://www.latextemplates.com/template/friggeri-resume-cv

\\documentclass[lighthipster]{simplehipstercv}
% available options are: darkhipster, lighthipster, pastel, allblack, grey, verylight, withoutsidebar
\\usepackage[utf8]{inputenc}
\\usepackage[default]{raleway}
\\usepackage[margin=1cm, a4paper]{geometry}

%------------------------------------------------------------------ Variables

\\newlength{\\rightcolwidth}
\\newlength{\\leftcolwidth}
\\setlength{\\leftcolwidth}{0.23\\textwidth}
\\setlength{\\rightcolwidth}{0.75\\textwidth}

%------------------------------------------------------------------
\\title{Professional CV}
\\author{${escapeLatex(data.personalInfo.name || 'Your Name')}}
\\date{\\today}

\\pagestyle{empty}
\\begin{document}

\\thispagestyle{empty}

\\section*{Start}

\\simpleheader{headercolour}{${escapeLatex(firstName)}}{${escapeLatex(lastName)}}{${escapeLatex(data.personalInfo.jobTitle || 'Your Title')}}{white}

\\subsection*{}
\\vspace{4em}

\\setlength{\\columnsep}{1.5cm}
\\columnratio{0.23}[0.75]
\\begin{paracol}{2}
\\hbadness5000

\\footnotesize
{\\setasidefontcolour
\\flushright

\\bg{cvgreen}{white}{About me}\\\\[0.5em]

{\\footnotesize
${escapeLatex(data.summary || 'Professional summary and key achievements.')}}
\\bigskip

\\bg{cvgreen}{white}{personal} \\\\[0.5em]
${escapeLatex(data.personalInfo.name || 'Your Name')}

${data.personalInfo.location ? escapeLatex(data.personalInfo.location) : 'Location'}

\\bigskip

${data.skills.technical.length > 0 ? `
\\bg{cvgreen}{white}{Technical Skills} \\\\[0.5em]

${data.skills.technical.slice(0, 8).map(skill => escapeLatex(skill)).join(' ~•~ ')}

\\bigskip
` : ''}

${data.skills.soft.length > 0 ? `
\\bg{cvgreen}{white}{Soft Skills}\\\\[0.5em]

${data.skills.soft.slice(0, 6).map(skill => escapeLatex(skill)).join(' ~•~ ')}

\\bigskip
` : ''}

\\vspace{4em}

\\infobubble{\\faAt}{cvgreen}{white}{${escapeLatex(data.personalInfo.email || 'email@example.com')}}
${data.personalInfo.linkedin ? `\\infobubble{\\faLinkedin}{cvgreen}{white}{${escapeLatex(data.personalInfo.linkedin)}}` : ''}
${data.personalInfo.github ? `\\infobubble{\\faGithub}{cvgreen}{white}{${escapeLatex(data.personalInfo.github)}}` : ''}

}
%-----------------------------------------------------------
\\switchcolumn

\\small
\\section*{Professional Experience}

\\begin{tabular}{r| p{0.5\\textwidth} c}
${data.experience.map(exp => `
    \\cvevent{${escapeLatex(exp.startDate || 'Start')}--${escapeLatex(exp.endDate || 'End')}}{${escapeLatex(exp.title || 'Job Title')}}{${escapeLatex(exp.company || 'Company')}}{${escapeLatex(exp.location || 'Location')} \\color{cvred}}{${escapeLatex(exp.description.join('. ') || 'Job description and achievements.')}}{} \\\\`).join('')}
\\end{tabular}
\\vspace{3em}

\\begin{minipage}[t]{0.35\\textwidth}
\\section*{Education}
\\begin{tabular}{r p{0.6\\textwidth} c}
${data.education.map(edu => `
    \\cvdegree{${escapeLatex(edu.graduationDate || 'Year')}}{${escapeLatex(edu.degree || 'Degree')}}{}{${escapeLatex(edu.school || 'School')} \\color{headerblue}}{}{} \\\\`).join('')}
\\end{tabular}
\\end{minipage}\\hfill
\\begin{minipage}[t]{0.3\\textwidth}
\\section*{Skills}
\\begin{tabular}{r @{\\hspace{0.5em}}l}
${data.skills.technical.slice(0, 5).map((skill, index) => {
  const level = Math.min(0.8, 0.3 + (index * 0.1)) // Vary skill levels
  return `     \\bg{skilllabelcolour}{iconcolour}{${escapeLatex(skill)}} &  \\barrule{${level}}{0.5em}{cvpurple}\\\\`
}).join('\n')}
\\end{tabular}
\\end{minipage}

${data.projects && data.projects.length > 0 ? `
\\section*{Projects}
\\begin{tabular}{r| p{0.5\\textwidth} c}
${data.projects.map(project => `
    \\cvevent{Recent}{${escapeLatex(project.name || 'Project Name')}}{${escapeLatex(project.technologies?.join(', ') || 'Technologies')}}{\\color{cvred}}{${escapeLatex(project.description || 'Project description')}}{} \\\\`).join('')}
\\end{tabular}
\\vspace{3em}
` : ''}

\\vfill{} % Whitespace before final footer

%----------------------------------------------------------------------------------------
%	FINAL FOOTER
%----------------------------------------------------------------------------------------
\\setlength{\\parindent}{0pt}
\\begin{minipage}[t]{\\rightcolwidth}
\\begin{center}\\fontfamily{\\sfdefault}\\selectfont \\color{black!70}
{\\small ${escapeLatex(data.personalInfo.name || 'Your Name')} \\icon{\\faEnvelopeO}{cvgreen}{} ${escapeLatex(data.personalInfo.email || 'email@example.com')} \\icon{\\faMapMarker}{cvgreen}{} ${escapeLatex(data.personalInfo.location || 'Location')} \\icon{\\faPhone}{cvgreen}{} ${escapeLatex(data.personalInfo.phone || 'Phone')}
}
\\end{center}
\\end{minipage}

\\end{paracol}

\\end{document}`
  }
}

// Academic CV Template
export const academicTemplate: LaTeXTemplate = {
  id: 'academic-cv',
  name: 'Academic CV',
  description: 'Professional academic CV template with publication list support',
  category: 'classic',
  atsOptimized: true,
  previewImage: '/images/latex-previews/academic-preview.png',
  overleafUrl: 'https://www.overleaf.com/latex/templates/academic-cv/kqjqvpqrqjqr',
  generateLaTeX: (data: ResumeData) => {
    const escapeLatex = (text: string): string => {
      return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\$/g, '\\$')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/#/g, '\\#')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde{}')
    }

    return `%%%%%%%%%%%%%%%
% This CV example/template is based on my own
% CV which I (lamely attempted) to clean up, so that
% it's less of an eyesore and easier for others to use.
%
% LianTze Lim (liantze@gmail.com)
% 23 Oct, 2022
% 24 Aug, 2024 -- Updated X (Twitter) icon
\\documentclass[a4paper,skipsamekey,11pt,english]{curve}

% Most commands and style definitions are in settings.sty.
\\usepackage{settings}

\\leftheader{%
  {\\LARGE\\bfseries\\sffamily ${escapeLatex(data.personalInfo.name || 'Your Name Here')}, Ph.D.}

  \\makefield{\\faEnvelope[regular]}{\\href{mailto:${escapeLatex(data.personalInfo.email || 'example@gmail.com')}}{\\texttt{${escapeLatex(data.personalInfo.email || 'example@gmail.com')}}}}
  ${data.personalInfo.linkedin ? `\\makefield{\\faLinkedin}{\\href{${escapeLatex(data.personalInfo.linkedin)}}{\\texttt{LinkedIn}}}` : ''}
  ${data.personalInfo.portfolio ? `\\makefield{\\faGlobe}{\\url{${escapeLatex(data.personalInfo.portfolio)}}}` : ''}
}

\\rightheader{~}

\\title{Curriculum Vitae}

\\begin{document}
\\makeheaders[c]

\\section{Employment History}

${data.experience.map(exp => `
\\entry{${escapeLatex(exp.startDate || 'Start')} -- ${escapeLatex(exp.endDate || 'End')}}
{\\textbf{${escapeLatex(exp.title || 'Position')}}, ${escapeLatex(exp.company || 'Institution')}}
{${escapeLatex(exp.location || 'Location')}}
{${escapeLatex(exp.description.join('. ') || 'Job description and key achievements.')}}
`).join('')}

\\section{Education}

${data.education.map(edu => `
\\entry{${escapeLatex(edu.graduationDate || 'Year')}}
{\\textbf{${escapeLatex(edu.degree || 'Degree')}}, ${escapeLatex(edu.school || 'University')}}
{${escapeLatex(edu.location || 'Location')}}
{${edu.honors && edu.honors.length > 0 ? escapeLatex(edu.honors.join(', ')) : 'Academic achievements and honors'}}
`).join('')}

${data.projects && data.projects.length > 0 ? `
\\section{Research Projects}

${data.projects.map(project => `
\\entry{Recent}
{\\textbf{${escapeLatex(project.name || 'Project Title')}}}
{${escapeLatex(project.technologies?.join(', ') || 'Technologies')}}
{${escapeLatex(project.description || 'Project description and outcomes.')}}
`).join('')}
` : ''}

\\section{Skills \\& Expertise}

\\begin{description}
${data.skills.technical.length > 0 ? `\\item[Technical Skills:] ${data.skills.technical.map(skill => escapeLatex(skill)).join(', ')}` : ''}
${data.skills.soft.length > 0 ? `\\item[Professional Skills:] ${data.skills.soft.map(skill => escapeLatex(skill)).join(', ')}` : ''}
${data.skills.languages && data.skills.languages.length > 0 ? `\\item[Languages:] ${data.skills.languages.map(lang => escapeLatex(lang)).join(', ')}` : ''}
\\end{description}

\\end{document}`
  }
}

export const latexTemplates: LaTeXTemplate[] = [
  altaCVTemplate,
  simpleHipsterTemplate,
  academicTemplate
]

export function getLatexTemplate(id: string): LaTeXTemplate | undefined {
  return latexTemplates.find(template => template.id === id)
} 