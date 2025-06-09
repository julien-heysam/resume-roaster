#!/usr/bin/env python3

import sys
import PyPDF2

def validate_resume_pdf(filename):
    try:
        with open(filename, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            full_text = ''
            for page in reader.pages:
                full_text += page.extract_text()
            
            print(f'📄 Resume PDF Analysis: {filename}')
            print(f'📄 Pages: {len(reader.pages)}')
            print(f'📄 Total text: {len(full_text)} characters')
            
            print('\n📋 Resume content validation:')
            resume_checks = [
                ('Name found', 'John Doe' in full_text),
                ('Title found', 'Senior Software Engineer' in full_text),
                ('Contact info', 'john.doe@email.com' in full_text),
                ('Phone number', '555' in full_text),
                ('Address', 'San Francisco' in full_text),
                ('Experience section', 'Experience' in full_text),
                ('Education section', 'Education' in full_text),
                ('Skills section', 'Technical Skills' in full_text or 'Programming Languages' in full_text),
                ('Company names', 'Tech Innovations' in full_text),
                ('Technologies', 'Python' in full_text and 'React' in full_text),
                ('Dates', '2020' in full_text and 'Present' in full_text),
                ('Projects', 'Projects' in full_text or 'E-commerce' in full_text),
                ('Certifications', 'AWS' in full_text or 'Certified' in full_text),
                ('Professional summary', 'Professional Summary' in full_text),
                ('Languages', 'Languages' in full_text or 'English' in full_text)
            ]
            
            passed = 0
            for check, result in resume_checks:
                status = '✅' if result else '❌'
                print(f'{status} {check}')
                if result: 
                    passed += 1
            
            print(f'\n📊 Resume score: {passed}/{len(resume_checks)} ({passed/len(resume_checks)*100:.1f}%)')
            
            if passed >= len(resume_checks) * 0.8:
                print('🎉 EXCELLENT: Resume PDF is high quality!')
            elif passed >= len(resume_checks) * 0.6:
                print('👍 GOOD: Resume PDF is acceptable')
            else:
                print('⚠️  NEEDS IMPROVEMENT: Resume PDF could be better')
                
            # Show sample text
            print(f'\n📋 Sample text (first 300 chars):')
            print('-' * 50)
            print(full_text[:300])
            print('-' * 50)
                
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    filename = sys.argv[1] if len(sys.argv) > 1 else "resume_test_output.pdf"
    validate_resume_pdf(filename) 