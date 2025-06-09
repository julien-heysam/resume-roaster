import { ResumeData } from './resume-templates'

export interface LaTeXTemplate {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'tech' | 'creative' | 'executive'
  atsOptimized: boolean
  previewImage: string
  overleafUrl?: string
  generateLaTeX: string
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
  generateLaTeX: `%%%%%%%%%%%%%%%%%
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

%% Use the "normalphoto" option if you want a normal photo instead of cropped to a circle
% \\documentclass[10pt,a4paper,normalphoto]{altacv}

\\documentclass[10pt,a4paper,ragged2e,withhyper]{altacv}
%% AltaCV uses the fontawesome5 and simpleicons packages.
%% See http://texdoc.net/pkg/fontawesome5 and http://texdoc.net/pkg/simpleicons for full list of symbols.

% Change the page layout if you need to
\\geometry{left=1.25cm,right=1.25cm,top=1.5cm,bottom=1.5cm,columnsep=1.2cm}

% The paracol package lets you typeset columns of text in parallel
\\usepackage{paracol}

% Change the font if you want to, depending on whether
% you're using pdflatex or xelatex/lualatex
% WHEN COMPILING WITH XELATEX PLEASE USE
% xelatex -shell-escape -output-driver="xdvipdfmx -z 0" sample.tex
\\iftutex 
  % If using xelatex or lualatex:
  \\setmainfont{Roboto Slab}
  \\setsansfont{Lato}
  \\renewcommand{\\familydefault}{\\sfdefault}
\\else
  % If using pdflatex:
  \\usepackage[rm]{roboto}
  \\usepackage[defaultsans]{lato}
  % \\usepackage{sourcesanspro}
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
% for \\cvskill if you want to
\\renewcommand{\\cvItemMarker}{{\\small\\textbullet}}
\\renewcommand{\\cvRatingMarker}{\\faCircle}
% ...and the markers for the date/location for \\cvevent
% \\renewcommand{\\cvDateMarker}{\\faCalendar*[regular]}
% \\renewcommand{\\cvLocationMarker}{\\faMapMarker*}


% If your CV/résumé is in a language other than English,
% then you probably want to change these so that when you
% copy-paste from the PDF or run pdftotext, the location
% and date marker icons for \\cvevent will paste as correct
% translations. For example Spanish:
% \\renewcommand{\\locationname}{Ubicación}
% \\renewcommand{\\datename}{Fecha}


%% Use (and optionally edit if necessary) this .tex if you
%% want to use an author-year reference style like APA(6)
%% for your publication list
% \\input{pubs-authoryear.tex}

%% Use (and optionally edit if necessary) this .tex if you
%% want an originally numerical reference style like IEEE
%% for your publication list
\\input{pubs-num.tex}

%% sample.bib contains your publications
\\addbibresource{sample.bib}
% \\usepackage{academicons}\\let\\faOrcid\\aiOrcid
\\begin{document}
\\name{Your Name Here}
\\tagline{Your Position or Tagline Here}
%% You can add multiple photos on the left or right
\\photoR{2.8cm}{Globe_High}
% \\photoL{2.5cm}{Yacht_High,Suitcase_High}

\\personalinfo{%
  % Not all of these are required!
  \\email{your_name@email.com}
  \\phone{000-00-0000}
  \\mailaddress{Åddrésş, Street, 00000 Cóuntry}
  \\location{Location, COUNTRY}
  \\homepage{www.homepage.com}
  % \\twitter{@twitterhandle}
  \\xtwitter{@x-handle}
  \\linkedin{your_id}
  \\github{your_id}
  \\orcid{0000-0000-0000-0000}
  %% You can add your own arbitrary detail with
  %% \\printinfo{symbol}{detail}[optional hyperlink prefix]
  % \\printinfo{\\faPaw}{Hey ho!}[https://example.com/]

  %% Or you can declare your own field with
  %% \\NewInfoFiled{fieldname}{symbol}[optional hyperlink prefix] and use it:
  % \\NewInfoField{gitlab}{\\faGitlab}[https://gitlab.com/]
  % \\gitlab{your_id}
  %%
  %% For services and platforms like Mastodon where there isn't a
  %% straightforward relation between the user ID/nickname and the hyperlink,
  %% you can use \\printinfo directly e.g.
  % \\printinfo{\\faMastodon}{@username@instace}[https://instance.url/@username]
  %% But if you absolutely want to create new dedicated info fields for
  %% such platforms, then use \\NewInfoField* with a star:
  % \\NewInfoField*{mastodon}{\\faMastodon}
  %% then you can use \\mastodon, with TWO arguments where the 2nd argument is
  %% the full hyperlink.
  % \\mastodon{@username@instance}{https://instance.url/@username}
}

\\makecvheader
%% Depending on your tastes, you may want to make fonts of itemize environments slightly smaller
% \\AtBeginEnvironment{itemize}{\\small}

%% Set the left/right column width ratio to 6:4.
\\columnratio{0.6}

% Start a 2-column paracol. Both the left and right columns will automatically
% break across pages if things get too long.
\\begin{paracol}{2}
\\cvsection{Experience}

\\cvevent{Job Title 1}{Company 1}{Month 20XX -- Ongoing}{Location}
\\begin{itemize}
\\item Job description 1
\\item Job description 2
\\end{itemize}

\\divider

\\cvevent{Job Title 2}{Company 2}{Month 20XX -- Ongoing}{Location}
\\begin{itemize}
\\item Job description 1
\\item Job description 2
\\end{itemize}

\\cvsection{Projects}

\\cvevent{Project 1}{Funding agency/institution}{}{}
\\begin{itemize}
\\item Details
\\end{itemize}

\\divider

\\cvevent{Project 2}{Funding agency/institution}{Project duration}{}
A short abstract would also work.

\\medskip

\\cvsection{A Day of My Life}

% Adapted from @Jake's answer from http://tex.stackexchange.com/a/82729/226
% \\wheelchart{outer radius}{inner radius}{
% comma-separated list of value/text width/color/detail}
\\wheelchart{1.5cm}{0.5cm}{%
  6/8em/accent!30/{Sleep,\\\\beautiful sleep},
  3/8em/accent!40/Hopeful novelist by night,
  8/8em/accent!60/Daytime job,
  2/10em/accent/Sports and relaxation,
  5/6em/accent!20/Spending time with family
}

% use ONLY \\newpage if you want to force a page break for
% ONLY the current column
\\newpage

\\cvsection{Publications}

%% Specify your last name(s) and first name(s) as given in the .bib to automatically bold your own name in the publications list.
%% One caveat: You need to write \\bibnamedelima where there's a space in your name for this to work properly; or write \\bibnamedelimi if you use initials in the .bib
%% You can specify multiple names, especially if you have changed your name or if you need to highlight multiple authors.
\\mynames{Lim/Lian\\bibnamedelima Tze,
  Wong/Lian\\bibnamedelima Tze,
  Lim/Tracy,
  Lim/L.\\bibnamedelimi T.}
%% MAKE SURE THERE IS NO SPACE AFTER THE FINAL NAME IN YOUR \\mynames LIST

\\nocite{*}

\\printbibliography[heading=pubtype,title={\\printinfo{\\faBook}{Books}},type=book]

\\divider

\\printbibliography[heading=pubtype,title={\\printinfo{\\faFile*[regular]}{Journal Articles}},type=article]

\\divider

\\printbibliography[heading=pubtype,title={\\printinfo{\\faUsers}{Conference Proceedings}},type=inproceedings]

%% Switch to the right column. This will now automatically move to the second
%% page if the content is too long.
\\switchcolumn

\\cvsection{My Life Philosophy}

\\begin{quote}
\`\`Something smart or heartfelt, preferably in one sentence.''
\\end{quote}

\\cvsection{Most Proud of}

\\cvachievement{\\faTrophy}{Fantastic Achievement}{and some details about it}

\\divider

\\cvachievement{\\faHeartbeat}{Another achievement}{more details about it of course}

\\divider

\\cvachievement{\\faHeartbeat}{Another achievement}{more details about it of course}

\\cvsection{Strengths}

% Don't overuse these \\cvtag boxes — they're just eye-candies and not essential. If something doesn't fit on a single line, it probably works better as part of an itemized list (probably inlined itemized list), or just as a comma-separated list of strengths.

% The ragged2e document class option might cause automatic linebreaks between \\cvtag to fail.
% Either remove the ragged2e option; or 
% add \\LaTeXraggedright in the paragraph for these \\cvtag
{\\LaTeXraggedright
\\cvtag{Hard-working}
\\cvtag{Eye for detail}
\\cvtag{Motivator \\& Leader}
\\par}

\\divider\\smallskip

%% ...Or manually add linebreaks yourself
\\cvtag{C++}
\\cvtag{Embedded Systems}\\\\
\\cvtag{Statistical Analysis}

\\cvsection{Languages}

\\cvskill{English}{5}
\\divider

\\cvskill{Spanish}{4}
\\divider

\\cvskill{German}{3.5} %% Supports X.5 values.

%% Yeah I didn't spend too much time making all the
%% spacing consistent... sorry. Use \\smallskip, \\medskip,
%% \\bigskip, \\vspace etc to make adjustments.
\\medskip

\\cvsection{Education}

\\cvevent{Ph.D.\\ in Your Discipline}{Your University}{Sept 2002 -- June 2006}{}
Thesis title: Wonderful Research

\\divider

\\cvevent{M.Sc.\\ in Your Discipline}{Your University}{Sept 2001 -- June 2002}{}

\\divider

\\cvevent{B.Sc.\\ in Your Discipline}{Stanford University}{Sept 1998 -- June 2001}{}

% \\divider

\\cvsection{Referees}

% \\cvref{name}{email}{mailing address}
\\cvref{Prof.\\ Alpha Beta}{Institute}{a.beta@university.edu}
{Address Line 1\\\\Address line 2}

\\divider

\\cvref{Prof.\\ Gamma Delta}{Institute}{g.delta@university.edu}
{Address Line 1\\\\Address line 2}


\\end{paracol}


\\end{document}`
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
  generateLaTeX: `
% a mashup of hipstercv, friggeri and twenty cv
% https://www.latextemplates.com/template/twenty-seconds-resumecv
% https://www.latextemplates.com/template/friggeri-resume-cv

\\documentclass[lighthipster]{simplehipstercv}
  % available options are: darkhipster, lighthipster, pastel, allblack, grey, verylight, withoutsidebar
  % withoutsidebar
  \\usepackage[utf8]{inputenc}
  \\usepackage[default]{raleway}
  \\usepackage[margin=1cm, a4paper]{geometry}
  
  %------------------------------------------------------------------ Variablen
  
  \\newlength{\\rightcolwidth}
  \\newlength{\\leftcolwidth}
  \\setlength{\\leftcolwidth}{0.23\\textwidth}
  \\setlength{\\rightcolwidth}{0.75\\textwidth}
  
  %------------------------------------------------------------------
  \\title{New Simple CV}
  \\author{\\LaTeX{} Ninja}
  \\date{June 2019}
  
  \\pagestyle{empty}
  \\begin{document}
  
  \\thispagestyle{empty}
  %-------------------------------------------------------------
  
  \\section*{Start}
  
  \\simpleheader{headercolour}{Jack}{Sparrow}{Captain}{white}
  
  %------------------------------------------------
  
  % this has to be here so the paracols starts..
  \\subsection*{}
  \\vspace{4em}
  
  \\setlength{\\columnsep}{1.5cm}
  \\columnratio{0.23}[0.75]
  \\begin{paracol}{2}
  \\hbadness5000
  %\\backgroundcolor{c[1]}[rgb]{1,1,0.8} % cream yellow for column-1 %\\backgroundcolor{g}[rgb]{0.8,1,1} % \\backgroundcolor{l}[rgb]{0,0,0.7} % dark blue for left margin
  
  \\paracolbackgroundoptions
  
  % 0.9,0.9,0.9 -- 0.8,0.8,0.8
  
  \\footnotesize
  {\\setasidefontcolour
  \\flushright
  \\begin{center}
      \\roundpic{jack.jpg}
  \\end{center}
  
  \\bg{cvgreen}{white}{About me}\\\\[0.5em]
  
  {\\footnotesize
  \\lorem\\lorem\\lorem}
  \\bigskip
  
  \\bg{cvgreen}{white}{personal} \\\\[0.5em]
  Jack Sparrow
  
  nationality: English 
  
  1690
  
  \\bigskip
  
  \\bg{cvgreen}{white}{Areas of specialization} \\\\[0.5em]
  
  Privateering ~•~ Bucaneering ~•~ Parler ~•~ Rum
  
  \\bigskip
  
  \\bigskip
  
  \\bg{cvgreen}{white}{Interests}\\\\[0.5em]
  
  \\lorem
  \\bigskip
  
  \\bg{cvgreen}{white}{Interests}\\\\[0.5em]
  
  \\texttt{R} ~/~ \\texttt{Android} ~/~ \\texttt{Linux}
  
  \\texttt{R} ~/~ \\texttt{Android} ~/~ \\texttt{Linux}
  
  \\texttt{R} ~/~ \\texttt{Android} ~/~ \\texttt{Linux}
  
  \\vspace{4em}
  
  \\infobubble{\\faAt}{cvgreen}{white}{jack@sparrow.org}
  \\infobubble{\\faTwitter}{cvgreen}{white}{@sparrow}
  \\infobubble{\\faFacebook}{cvgreen}{white}{Jack Sparrow}
  \\infobubble{\\faGithub}{cvgreen}{white}{sparrow}
  
  \\phantom{turn the page}
  
  \\phantom{turn the page}
  }
  %-----------------------------------------------------------
  \\switchcolumn
  
  \\small
  \\section*{Short Resumé}
  
  \\begin{tabular}{r| p{0.5\\textwidth} c}
      \\cvevent{2018--2021}{Captain of the Black Pearl}{Lead}{East Indies \\color{cvred}}{Finally got the goddamn ship back.\\lorem\\lorem\\lorem}{disney.png} \\\\
      \\cvevent{2016--2017}{Captain of the Black Pearl}{Lead}{Tortuga \\color{cvred}}{Found a secret treasure, lost the ship. \\lorem\\lorem}{medal.jpeg}
  \\end{tabular}
  \\vspace{3em}
  
  \\begin{minipage}[t]{0.35\\textwidth}
  \\section*{Degrees}
  \\begin{tabular}{r p{0.6\\textwidth} c}
      \\cvdegree{1710}{Captain}{Certified}{Tortuga Uni \\color{headerblue}}{}{disney.png} \\\\
      \\cvdegree{1715}{Bucaneering}{M.A.}{London \\color{headerblue}}{}{medal.jpeg} \\\\
      \\cvdegree{1720}{Bucaneering}{B.A.}{London \\color{headerblue}}{}{medal.jpeg}
  \\end{tabular}
  \\end{minipage}\\hfill
  \\begin{minipage}[t]{0.3\\textwidth}
  \\section*{Programming}
  \\begin{tabular}{r @{\hspace{0.5em}}l}
       \\bg{skilllabelcolour}{iconcolour}{html, css} &  \\barrule{0.4}{0.5em}{cvpurple}\\\\
       \\bg{skilllabelcolour}{iconcolour}{\\LaTeX} & \\barrule{0.55}{0.5em}{cvgreen} \\\\
       \\bg{skilllabelcolour}{iconcolour}{python} & \\barrule{0.5}{0.5em}{cvpurple} \\\\
       \\bg{skilllabelcolour}{iconcolour}{R} & \\barrule{0.25}{0.5em}{cvpurple} \\\\
       \\bg{skilllabelcolour}{iconcolour}{javascript} & \\barrule{0.1}{0.5em}{cvpurple} \\\\
  \\end{tabular}
  \\end{minipage}
  
  \\section*{Curriculum}
  \\begin{tabular}{r| p{0.5\\textwidth} c}
      \\cvevent{2018--2021}{Captain of the Black Pearl}{Lead}{East Indies \\color{cvred}}{Finally got the goddamn ship back. \\lorem}{disney.png} \\\\
      \\cvevent{2019}{Freelance Pirate}{Bucaneering}{Tortuga \\color{cvred}}{This and that. The usual, aye?  \\lorem}{medal.jpeg} \\\\
  \\end{tabular}
  \\vspace{3em}
  
  \\begin{minipage}[t]{0.3\\textwidth}
  \\section*{Certificates \\& Grants}
  \\begin{tabular}{>{\\footnotesize\\bfseries}r >{\\footnotesize}p{0.55\\textwidth}}
      1708 & Captain's Certificates \\\\
      1710 & Travel grant \\\\
      1715--1716 & Grant from the Pirate's Company
  \\end{tabular}
  \\bigskip
  
  \\section*{Languages}
  \\begin{tabular}{l | ll}
  \\textbf{English} & C2 & {\\phantom{x}\\footnotesize mother tongue} \\\\
  \\textbf{French} & C2 & \\pictofraction{\\faCircle}{cvgreen}{3}{black!30}{1}{\\tiny} \\\\
  \\textbf{Spanish} & C2 & \\pictofraction{\\faCircle}{cvgreen}{1}{black!30}{3}{\\tiny} \\\\
  \\textbf{Italian} & C2 & \\pictofraction{\\faCircle}{cvgreen}{3}{black!30}{1}{\\tiny}
  \\end{tabular}
  \\bigskip
  
  \\end{minipage}\\hfill
  
  \\begin{minipage}[t]{0.3\\textwidth}
  
     \\section*{Publications}
      \\begin{tabular}{>{\\footnotesize\\bfseries}r >{\\footnotesize}p{0.7\\textwidth}}
       1729 & \\emph{How I almost got killed by Lady Swan}, Tortuga Printing Press. \\\\
       1720 & \`\`Privateering for Beginners'', in: \\emph{The Pragmatic Pirate} (1/1720).
  
  \\end{tabular}
  \\bigskip
  
  \\section*{Talks}
  \\begin{tabular}{>{\\footnotesize\\bfseries}r >{\\footnotesize}p{0.7\\textwidth}}
      1729 & \\emph{How I almost got killed by Lady Swan}, Tortuga Printing Press. \\\\
      1720 & \`\`Privateering for Beginners'', in: \\emph{The Pragmatic Pirate} (1/1720).
  
  \\end{tabular}
  \\bigskip
  
  \\section*{Talks}
  \\begin{tabular}{>{\\footnotesize\\bfseries}r >{\\footnotesize}p{0.6\\textwidth}}
      Nov. 1726 & \`\`How I lost my ship (\\& and how to get it back)'', at: \\emph{Annual Pirate's Conference} in Tortuga, Nov. 1726.
  \\end{tabular}
  \\end{minipage}
  
  \\vfill{} % Whitespace before final footer
  
  %----------------------------------------------------------------------------------------
  %	FINAL FOOTER
  %----------------------------------------------------------------------------------------
  \\setlength{\\parindent}{0pt}
  \\begin{minipage}[t]{\\rightcolwidth}
  \\begin{center}\\fontfamily{\\sfdefault}\\selectfont \\color{black!70}
  {\\small Jack Sparrow \\icon{\\faEnvelopeO}{cvgreen}{} The Black Pearl \\icon{\\faMapMarker}{cvgreen}{} Tortuga \\icon{\\faPhone}{cvgreen}{} 0099/333 5647380 \\newline\\icon{\\faAt}{cvgreen}{} \\protect\\url{jack@sparrow.com}
  }
  \\end{center}
  \\end{minipage}
  
  \\end{paracol}
  
  \\end{document}`
}

// Academic CV Template
export const academicTemplate: LaTeXTemplate = {
  id: 'academic-cv',
  name: 'Academic CV',
  description: 'Professional academic CV template with publication list support',
  category: 'classic',
  atsOptimized: true,
  previewImage: '/images/latex-previews/academic-preview.png',
  overleafUrl: 'https://www.overleaf.com/project/684646e8a9ae06e57b9e1545',
  generateLaTeX: `
%%%%%%%%%%%%%%%
% This CV example/template is based on my own
% CV which I (lamely attempted) to clean up, so that
% it's less of an eyesore and easier for others to use.
%
% LianTze Lim (liantze@gmail.com)
% 23 Oct, 2022
% 24 Aug, 2024 -- Updated X (Twitter) icon
\documentclass[a4paper,skipsamekey,11pt,english]{curve}

% Uncomment to enable Chinese; needs XeLaTeX
% \\usepackage{ctex}


% Default biblatex style used for the publication list is APA6. If you wish to use a different style or pass other options to biblatex you can change them here. 
\PassOptionsToPackage{style=ieee,sorting=ydnt,uniquename=init,defernumbers=true}{biblatex}

% Most commands and style definitions are in settings.sty.
\\usepackage{settings}

% If you need to further customise your biblatex setup e.g. with \DeclareFieldFormat etc please add them here AFTER loading settings.sty. For example, to remove the default "[Online] Available:" prefix before URLs when using the IEEE style:
\DefineBibliographyStrings{english}{url={\textsc{url}}}

%% Only needed if you want a Publication List
\addbibresource{own-bib.bib}

%% Specify your last name(s) and first name(s) (as given in the .bib) to automatically bold your own name in the publications list. 
%% One caveat: You need to write \bibnamedelima where there's a space in your name for this to work properly; or write \bibnamedelimi if you use initials in the .bib
% \mynames{Lim/Lian\bibnamedelima Tze}

%% You can specify multiple names like this, especially if you have changed your name or if you need to highlight multiple authors. See items 6–9 in the example "Journal Articles" output.
\mynames{Lim/Lian\bibnamedelima Tze,
  Wong/Lian\bibnamedelima Tze,
  Lim/Tracy,
  Lim/L.\bibnamedelimi T.}
%% MAKE SURE THERE IS NO SPACE AFTER THE FINAL NAME IN YOUR \mynames LIST

% Change the fonts if you want
\ifxetexorluatex % If you're using XeLaTeX or LuaLaTeX
  \\usepackage{fontspec} 
  %% You can use \setmainfont etc; I'm just using these font packages here because they provide OpenType fonts for use by XeLaTeX/LuaLaTeX anyway
  \\usepackage[p,osf,swashQ]{cochineal}
  \\usepackage[medium,bold]{cabin}
  \\usepackage[varqu,varl,scale=0.9]{zi4}
\else % If you're using pdfLaTeX or latex
  \\usepackage[T1]{fontenc}
  \\usepackage[p,osf,swashQ]{cochineal}
  \\usepackage{cabin}
  \\usepackage[varqu,varl,scale=0.9]{zi4}
\fi

% Change the page margins if you want
% \geometry{left=1cm,right=1cm,top=1.5cm,bottom=1.5cm}

% Change the colours if you want
% \definecolor{SwishLineColour}{HTML}{00FFFF}
% \definecolor{MarkerColour}{HTML}{0000CC}

% Change the item prefix marker if you want
% \prefixmarker{$\diamond$}

%% Photo is only shown if "fullonly" is included
\includecomment{fullonly}
% \excludecomment{fullonly}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


\leftheader{%
  {\LARGE\bfseries\sffamily Your Name Here, Ph.D.}

  \makefield{\faEnvelope[regular]}{\href{mailto:example@gmail.com}{\texttt{example@gmail.com}}}
  % fontawesome5 doesn't have the X icon so we use
  % the simpleicons package here instead; but some 
  % font size adjustment might be needed
  \makefield{{\scriptsize\simpleicon{x}}}{\!\href{https://x.com/overleaf_example}{\texttt{@overleaf\_example}}}
  \makefield{\faLinkedin}
  {\href{http://www.linkedin.com/in/example/}{\texttt{example}}}

  %% Next line
  \makefield{\faGlobe}{\\url{http://example.example.org/}}
  % You can use a tabular here if you want to line up the fields.
}

\rightheader{~}
\begin{fullonly}
\photo[r]{photo}
\photoscale{0.13}
\end{fullonly}

\title{Curriculum Vitae}

\begin{document}
\makeheaders[c]

\makerubric{employment}
\makerubric{education}

% If you're not a researcher nor an academic, you probably don't have any publications; delete this line.
%% Sometimes when a section can't be nicely modelled with the \entry[]... mechanism; hack our own and use \input NOT \makerubric
\input{publications}

\makerubric{skills}
\makerubric{misc}

\makerubric{referee}
% \input{referee-full}

\end{document}`  
}

export const latexTemplates: LaTeXTemplate[] = [
  altaCVTemplate,
  simpleHipsterTemplate,
  academicTemplate
]

export function getLatexTemplate(id: string): LaTeXTemplate | undefined {
  return latexTemplates.find(template => template.id === id)
}