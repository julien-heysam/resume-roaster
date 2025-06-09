#!/usr/bin/env python3

import sys

def validate_pdf(filename):
    try:
        import PyPDF2
        
        with open(filename, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            print(f'📄 PDF Analysis: {filename}')
            print(f'📄 Number of pages: {len(reader.pages)}')
            
            # Extract text from all pages
            full_text = ''
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                full_text += page_text
                print(f'📄 Page {i+1} text length: {len(page_text)} characters')
            
            print(f'📄 Total text length: {len(full_text)} characters')
            
            # Show first 500 characters
            print('\n📋 First 500 characters of extracted text:')
            print('-' * 50)
            print(full_text[:500])
            print('-' * 50)
            
            # Content validation checks
            checks = [
                ('Title found', 'Comprehensive LaTeX Test Document' in full_text),
                ('Author found', 'Resume Roaster Service' in full_text),
                ('Table of Contents', 'Contents' in full_text or 'Introduction' in full_text),
                ('Professional Experience', 'Professional Experience' in full_text),
                ('Mathematics', 'quadratic formula' in full_text or 'Euler' in full_text),
                ('Table content', 'Alice' in full_text and 'Grade' in full_text),
                ('Skills section', 'Technical Skills' in full_text),
                ('Programming languages', 'Python' in full_text and 'JavaScript' in full_text),
                ('Education section', 'Master of Science' in full_text or 'Bachelor' in full_text),
                ('Special characters', 'café' in full_text or 'résumé' in full_text),
                ('Mathematical symbols', any(symbol in full_text for symbol in ['α', 'β', 'γ', 'Δ', 'Ω'])),
                ('Lists and bullets', 'Led development' in full_text),
                ('Dates and formatting', '2020' in full_text and 'Present' in full_text)
            ]
            
            print('\n📋 Content validation results:')
            print('=' * 50)
            passed_count = 0
            for check_name, passed in checks:
                status = '✅' if passed else '❌'
                print(f'{status} {check_name}')
                if passed:
                    passed_count += 1
            
            print('=' * 50)
            print(f'📊 Overall score: {passed_count}/{len(checks)} checks passed ({passed_count/len(checks)*100:.1f}%)')
            
            if passed_count >= len(checks) * 0.8:  # 80% or more
                print('🎉 EXCELLENT: PDF quality is very good!')
            elif passed_count >= len(checks) * 0.6:  # 60% or more
                print('👍 GOOD: PDF quality is acceptable')
            else:
                print('⚠️  NEEDS IMPROVEMENT: PDF quality could be better')
                
    except ImportError:
        print('PyPDF2 not available. Installing...')
        import subprocess
        result = subprocess.run([sys.executable, '-m', 'pip', 'install', 'PyPDF2'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print('PyPDF2 installed successfully. Please run the script again.')
        else:
            print(f'Failed to install PyPDF2: {result.stderr}')
    except Exception as e:
        print(f'Error validating PDF: {e}')

if __name__ == "__main__":
    filename = sys.argv[1] if len(sys.argv) > 1 else "comprehensive_test_output.pdf"
    validate_pdf(filename) 