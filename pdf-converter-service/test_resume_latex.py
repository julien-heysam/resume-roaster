#!/usr/bin/env python3

import requests
import json
import sys

# Resume-style LaTeX document
resume_latex = r"""
\documentclass[11pt,a4paper,sans]{moderncv}
\moderncvstyle{classic}
\moderncvcolor{blue}

\usepackage[utf8]{inputenc}
\usepackage[scale=0.75]{geometry}

% Personal data
\name{John}{Doe}
\title{Senior Software Engineer}
\address{123 Tech Street}{San Francisco, CA 94105}{USA}
\phone[mobile]{+1~(555)~123~4567}
\email{john.doe@email.com}
\homepage{www.johndoe.com}
\social[linkedin]{johndoe}
\social[github]{johndoe}

\begin{document}

\makecvtitle

\section{Professional Summary}
Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and mentoring development teams.

\section{Experience}
\cventry{2020--Present}{Senior Software Engineer}{Tech Innovations Inc.}{San Francisco, CA}{}{
\begin{itemize}
\item Led development of microservices architecture serving 2M+ daily active users
\item Implemented CI/CD pipelines reducing deployment time by 75\%
\item Mentored 5 junior developers and conducted technical interviews
\item Technologies: Python, React, AWS, Docker, Kubernetes
\end{itemize}}

\cventry{2018--2020}{Software Engineer}{StartupCorp}{Palo Alto, CA}{}{
\begin{itemize}
\item Developed RESTful APIs and responsive web applications
\item Optimized database queries improving application performance by 50\%
\item Collaborated with product managers and designers in Agile environment
\item Technologies: Node.js, PostgreSQL, Redis, JavaScript
\end{itemize}}

\cventry{2016--2018}{Junior Developer}{WebSolutions LLC}{San Jose, CA}{}{
\begin{itemize}
\item Built and maintained e-commerce platforms for small businesses
\item Implemented automated testing suites increasing code coverage to 90\%
\item Participated in code reviews and sprint planning sessions
\item Technologies: PHP, MySQL, HTML/CSS, jQuery
\end{itemize}}

\section{Education}
\cventry{2012--2016}{Bachelor of Science in Computer Science}{University of California}{Berkeley, CA}{\textit{GPA: 3.7/4.0}}{
\begin{itemize}
\item Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering
\item Senior Project: Machine Learning-based Recommendation System
\end{itemize}}

\section{Technical Skills}
\cvitem{Programming Languages}{Python, JavaScript, Java, C++, Go, TypeScript}
\cvitem{Frameworks \& Libraries}{React, Node.js, Django, Flask, Spring Boot, Express.js}
\cvitem{Databases}{PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch}
\cvitem{Cloud \& DevOps}{AWS, Docker, Kubernetes, Jenkins, GitLab CI, Terraform}
\cvitem{Tools \& Technologies}{Git, Linux, Nginx, Apache, REST APIs, GraphQL}

\section{Projects}
\cventry{2023}{E-commerce Platform}{Personal Project}{}{}{
\begin{itemize}
\item Built full-stack e-commerce application with React frontend and Django backend
\item Integrated Stripe payment processing and AWS S3 for file storage
\item Deployed using Docker containers on AWS ECS
\item \textbf{GitHub:} github.com/johndoe/ecommerce-platform
\end{itemize}}

\cventry{2022}{Task Management API}{Open Source}{}{}{
\begin{itemize}
\item Developed RESTful API for task management with authentication and real-time updates
\item Used FastAPI, PostgreSQL, and WebSocket connections
\item Achieved 99.9\% uptime with comprehensive monitoring
\item \textbf{GitHub:} github.com/johndoe/task-api
\end{itemize}}

\section{Certifications}
\cvitem{2023}{AWS Certified Solutions Architect - Associate}
\cvitem{2022}{Certified Kubernetes Administrator (CKA)}
\cvitem{2021}{Google Cloud Professional Developer}

\section{Languages}
\cvitemwithcomment{English}{Native}{Professional working proficiency}
\cvitemwithcomment{Spanish}{Intermediate}{Conversational level}
\cvitemwithcomment{French}{Basic}{Elementary proficiency}

\end{document}
"""

def test_resume_latex(base_url):
    """Test the Tectonic endpoint with a resume-style LaTeX document"""
    print(f"Testing resume LaTeX document at: {base_url}")
    print("=" * 60)
    
    # Test Tectonic endpoint with resume
    endpoint = f"{base_url}/latex-to-pdf-tectonic"
    print(f"Testing endpoint: {endpoint}")
    
    payload = {
        "latex_code": resume_latex,
        "filename": "john_doe_resume.pdf"
    }
    
    try:
        print("Sending resume LaTeX document for compilation...")
        response = requests.post(
            endpoint, 
            json=payload, 
            timeout=45,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Resume LaTeX compilation successful!")
            
            # Save the PDF
            filename = "resume_test_output.pdf"
            with open(filename, 'wb') as f:
                f.write(response.content)
            
            pdf_size = len(response.content)
            print(f"📄 PDF size: {pdf_size:,} bytes")
            print(f"📄 PDF saved as '{filename}'")
            
            # Basic PDF validation
            if response.content.startswith(b'%PDF-'):
                print("✅ PDF header is valid!")
                
                # Try to validate content
                try:
                    import subprocess
                    result = subprocess.run(['python', 'validate_pdf.py', filename], 
                                          capture_output=True, text=True, timeout=30)
                    if result.returncode == 0:
                        print("\n" + result.stdout)
                    else:
                        print(f"Validation error: {result.stderr}")
                except Exception as e:
                    print(f"Could not run validation: {e}")
            else:
                print("❌ Invalid PDF header!")
            
        else:
            print(f"❌ Resume LaTeX compilation failed!")
            print(f"Status code: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Error: {error_detail}")
            except:
                print(f"Error: {response.text[:500]}")
                
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
    except Exception as e:
        print(f"❌ Request error: {e}")

if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    test_resume_latex(base_url) 