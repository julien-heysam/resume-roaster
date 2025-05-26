# Authentication Setup Guide

## 🔐 Authentication System

Resume Roaster now includes a complete authentication system with:
- **Email/Password Registration & Login**
- **Google OAuth** (optional)
- **GitHub OAuth** (optional)
- **Session Management** with NextAuth.js
- **Database Integration** with user management

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/resume_roaster"

# AI Provider
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# NextAuth.js (Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

### 2. Generate NextAuth Secret

```bash
# Generate a secure secret
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. OAuth Setup (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

## 🎯 Features

### ✅ Email/Password Authentication
- Secure password hashing with bcryptjs
- Email validation
- Account creation and login
- Automatic database user creation

### ✅ OAuth Integration
- Google and GitHub sign-in
- Automatic account linking
- User profile synchronization

### ✅ Session Management
- JWT-based sessions
- Automatic session refresh
- Secure logout functionality

### ✅ Database Integration
- User creation with subscription tiers
- Automatic FREE tier assignment
- Usage tracking integration

## 🧭 Navigation

### Authenticated Users
- **User dropdown** with name/email
- **Dashboard** link (ready for implementation)
- **Upgrade** link to pricing
- **Sign out** functionality

### Anonymous Users
- **Sign In** button
- **Sign Up** button
- **Continue as Guest** option

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers
- Session management via NextAuth

### Protected Routes
Ready for middleware implementation to protect:
- Dashboard routes
- User settings
- Premium features

## 🎨 UI/UX Features

### Authentication Pages
- **Professional signup form** with validation
- **Secure signin form** with error handling
- **Social login buttons** (Google/GitHub)
- **Mobile-responsive** design
- **Loading states** and error messages

### Navigation
- **Dynamic user menu** showing auth state
- **Mobile hamburger menu** with auth options
- **Smooth transitions** and loading indicators

## 🔒 Security

### Password Security
- **bcryptjs hashing** with salt rounds
- **Minimum 8 character** requirement
- **Password confirmation** validation

### Session Security
- **JWT tokens** with secure secrets
- **HttpOnly cookies** (NextAuth default)
- **CSRF protection** built-in
- **Secure headers** for production

## 📱 User Experience

### Onboarding Flow
1. User visits site → See signup/signin options
2. Register with email/password or OAuth
3. Automatically signed in after registration
4. Redirected to homepage with user menu
5. Start using premium features based on tier

### Guest Flow
- Users can still use free features without account
- Prompted to sign up when hitting limits
- Easy conversion to authenticated user

## 🚀 Ready for Production

Your authentication system is now enterprise-ready with:
- ✅ Secure password handling
- ✅ OAuth integration
- ✅ Database persistence
- ✅ Session management
- ✅ Mobile-responsive UI
- ✅ Error handling
- ✅ Loading states

## 🔧 Next Steps

1. **Set environment variables** as shown above
2. **Test registration** with email/password
3. **Test OAuth providers** (optional)
4. **Implement dashboard** for authenticated users
5. **Add protected routes** with middleware
6. **Configure production** NextAuth settings

Your Resume Roaster now has a complete authentication system! 🎉 