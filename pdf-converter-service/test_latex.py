#!/usr/bin/env python3
"""
Test script for LaTeX to PDF compilation
"""

import requests
import json

# Test LaTeX code
test_latex = r"""
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}
\usepackage{amsfonts}
\usepackage{amssymb}

\title{Test Document}
\author{Resume Roaster}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}
This is a test document to verify LaTeX compilation.

\section{Mathematics}
Here's a simple equation:
\begin{equation}
E = mc^2
\end{equation}

And some inline math: $\int_0^1 x^2 dx = \frac{1}{3}$

\section{Lists}
\begin{itemize}
    \item First item
    \item Second item
    \item Third item
\end{itemize}

\end{document}
"""

def test_latex_endpoint(base_url="http://localhost:8000", endpoint="/latex-to-pdf"):
    """Test the LaTeX compilation endpoint"""
    
    url = f"{base_url}{endpoint}"
    
    payload = {
        "latex_code": test_latex,
        "filename": "test_document.pdf"
    }
    
    print(f"Testing endpoint: {url}")
    print("Sending LaTeX code for compilation...")
    
    try:
        response = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        
        if response.status_code == 200:
            print("✅ LaTeX compilation successful!")
            print(f"PDF size: {len(response.content)} bytes")
            
            # Save the PDF for inspection
            with open("test_output.pdf", "wb") as f:
                f.write(response.content)
            print("📄 PDF saved as 'test_output.pdf'")
            
        else:
            print(f"❌ LaTeX compilation failed!")
            print(f"Status code: {response.status_code}")
            print(f"Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

def test_health_endpoint(base_url="http://localhost:8000"):
    """Test the health endpoint"""
    
    url = f"{base_url}/health"
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check request failed: {e}")

if __name__ == "__main__":
    import sys
    
    base_url = "http://localhost:8000"
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    
    print(f"Testing LaTeX service at: {base_url}")
    print("=" * 50)
    
    # Test health first
    test_health_endpoint(base_url)
    print()
    
    # Test regular LaTeX endpoint
    print("Testing regular LaTeX endpoint...")
    test_latex_endpoint(base_url, "/latex-to-pdf")
    print()
    
    # Test Tectonic endpoint
    print("Testing Tectonic LaTeX endpoint...")
    test_latex_endpoint(base_url, "/latex-to-pdf-tectonic") 