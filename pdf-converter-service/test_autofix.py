#!/usr/bin/env python3

# Test script to debug the auto-fix function
import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import validate_and_fix_latex_content

# Test LaTeX with FontAwesome commands
test_latex = r"""\documentclass{article}
\begin{document}
\faEnvelope test@email.com\\
\faPhone +1234567890
\end{document}"""

print("Original LaTeX:")
print(test_latex)
print("\n" + "="*50 + "\n")

fixed_latex, warnings = validate_and_fix_latex_content(test_latex)

print("Fixed LaTeX:")
print(fixed_latex)
print("\n" + "="*50 + "\n")

print("Warnings:")
for warning in warnings:
    print(f"- {warning}") 