# Job Description Extraction Guide

## Supported Sites

The automatic job description extraction works best with:
- Company career pages (e.g., `careers.company.com`)
- Job boards that don't block automation
- Direct job posting URLs from smaller job sites

## Blocked Sites

Some major job sites actively block automated scraping:

### Glassdoor
- **Status**: Blocked 🚫
- **Alternative**: Look for the same job on the company's direct career page
- **Manual Option**: Copy and paste the job description text manually

### LinkedIn 
- **Status**: Blocked 🚫
- **Alternative**: Search for the company's careers page or the job on other sites
- **Manual Option**: Copy and paste the job description text manually

### Indeed
- **Status**: May be blocked ⚠️
- **Alternative**: Try the company's direct career page
- **Manual Option**: Copy and paste the job description text manually

## Best Practices

1. **Use Company Career Pages**: Instead of job board URLs, try to find the job posting on the company's official website
   - Example: Instead of a Glassdoor URL, go to `company.com/careers`

2. **Direct Application Links**: Many job posts on blocked sites include a "Apply on company website" link - use that URL instead

3. **Manual Copy-Paste**: If automatic extraction fails, you can always copy the job description text and paste it manually into the resume analysis tool

## How to Find Company Career Pages

1. Google: `[Company Name] careers`
2. Go to the company's main website and look for "Careers" or "Jobs" in the footer/header
3. Check if the job posting mentions the company website

## Error Messages Explained

- **403 Forbidden**: The site is actively blocking our request
- **Rate Limited**: Too many requests - wait a moment and try again
- **Job not found**: The URL may be expired or incorrect

## Tips for Success

- Use direct URLs from company websites when possible
- Avoid URLs with tracking parameters (long URLs with `utm_` parameters)
- If a site consistently fails, bookmark it as one that requires manual input 