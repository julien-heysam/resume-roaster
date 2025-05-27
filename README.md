# Resume Roaster 🔥

Brutally honest AI-powered resume feedback that transforms weak resumes into interview magnets.

## Overview

Resume Roaster is a Next.js application that provides detailed, no-holds-barred analysis of resumes using AI technology. Unlike typical feedback tools, Resume Roaster gives honest, actionable insights that actually help job seekers improve their chances of getting hired.

## Features

### Core Analysis Engine
- **Resume Upload**: Support for PDF, DOC, TXT, and DOCX files with drag-and-drop interface
- **Job Matching**: Paste job posting URLs or text for targeted analysis  
- **Roast Score**: 0-100% compatibility rating with detailed breakdown
- **Keyword Analysis**: Identifies missing skills and keywords from job requirements
- **ATS Optimization**: Ensures resume passes applicant tracking systems

### Smart Feedback
- **Brutally Honest Analysis**: No sugar-coating - honest feedback about weaknesses
- **Strength Identification**: Highlights what's working well
- **Specific Suggestions**: Actionable improvements for each resume section
- **Priority Levels**: High/medium/low priority fixes for focused improvement

### Future Features (Roadmap)
- AI-powered resume rewriting
- Cover letter generation
- LinkedIn optimization
- Interview question preparation
- Salary negotiation insights
- Application tracking
- Success analytics

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **File Upload**: React Dropzone for drag-and-drop functionality
- **Icons**: Lucide React
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-roaster
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── analysis/          # Analysis results page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
│       ├── button.tsx    # Button component with variants
│       ├── card.tsx      # Card layouts
│       ├── progress.tsx  # Progress bars
│       └── file-upload.tsx # File upload with drag-and-drop
└── lib/                  # Utility functions
    └── utils.ts          # Class name utilities
```

## Design System

The application uses a cohesive design system with:

- **Colors**: Orange/red gradient theme representing the "roasting" concept
- **Typography**: Clean, modern font stack with proper hierarchy
- **Components**: Consistent spacing, shadows, and interactions
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design that works on all devices

## Key Pages

### Landing Page (`/`)
- Hero section with value proposition
- File upload interface
- Feature showcase
- Call-to-action sections

### Analysis Page (`/analysis`)
- Roast score with progress indicator
- Strengths and weaknesses breakdown
- Specific improvement suggestions
- Keyword matching analysis
- Quick action items
- Premium feature upsell

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Use the existing design system for consistency
4. Follow TypeScript best practices

## Deployment

The app is ready for deployment on platforms like:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Contact

[Add contact information]

---

**Resume Roaster** - Because nice feedback won't get you hired. 🔥
