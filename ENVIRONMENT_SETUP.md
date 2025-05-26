# Environment Variables Setup

## Required Environment Variables

To use the job description extraction with web search fallback, you need to set up the following environment variables in your `.env.local` file:

### Brave Search API Key
```bash
BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
```

**How to get a Brave Search API key:**
1. Go to [Brave Search API](https://api.search.brave.com/)
2. Sign up for an account
3. Create a new API key
4. Copy the key to your `.env.local` file

### Other Required Variables
```bash
# NextAuth configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database (if using)
DATABASE_URL=your_database_url

# AI API keys (if using)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Setup Instructions

1. Create a `.env.local` file in your project root
2. Add all the required environment variables
3. Restart your development server

The web search fallback will automatically activate when direct scraping fails due to 403 errors or other blocking mechanisms. 