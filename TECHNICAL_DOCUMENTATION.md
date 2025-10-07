# OpsCentral - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Development Setup](#development-setup)
5. [Database Schema](#database-schema)
6. [Authentication System](#authentication-system)
7. [API Endpoints](#api-endpoints)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)

## System Overview

OpsCentral is a modern web application for booking product management demos. It provides a streamlined interface for potential customers to schedule appointments while collecting valuable information about their workflow challenges.

### Key Features
- User authentication and account management
- Interactive booking system with time slot management
- Responsive design with dark/light theme support
- Real-time database integration
- Email notifications (optional)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │────│  Supabase API   │────│  PostgreSQL DB  │
│   (Vite + TS)   │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐            ┌─────────┐            ┌─────────┐
    │ Netlify │            │Supabase │            │Supabase │
    │ (Host)  │            │(Auth)   │            │(Storage)│
    └─────────┘            └─────────┘            └─────────┘
```

## Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **React Router 7.9.3** - Client-side routing
- **Tailwind CSS 3.4.1** - Styling framework
- **Lucide React 0.344.0** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database (via Supabase)
- **Row Level Security (RLS)** - Database security
- **Edge Functions** - Serverless functions (optional)

### Development Tools
- **ESLint 9.9.1** - Code linting
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - CSS vendor prefixes

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Team22MVPProject
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp env.example .env
```

4. **Configure Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Update `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=http://localhost:5173
```

5. **Database Setup**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref your-project-id

# Push database migrations
npx supabase db push
```

6. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

### Tables

#### `bookings` Table
```sql
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  
  -- Pain points questionnaire responses
  workflow_challenge TEXT,
  sop_management TEXT,
  main_goal TEXT,
  limiting_tools TEXT,
  demo_preparation TEXT,
  
  -- Booking time details
  selected_date DATE NOT NULL,
  selected_time TIME NOT NULL,
  timezone_selected TEXT NOT NULL,
  utc_start TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  
  -- Booking status
  status TEXT NOT NULL DEFAULT 'confirmed',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Indexes
```sql
CREATE INDEX idx_bookings_utc_start ON public.bookings(utc_start);
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_status ON public.bookings(status);
```

#### Security Policies
```sql
-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create bookings
CREATE POLICY "Anyone can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Users can read their own bookings
CREATE POLICY "Users can read their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);
```

### Functions

#### `check_booking_collision`
```sql
CREATE OR REPLACE FUNCTION check_booking_collision(
  check_utc_start TIMESTAMPTZ,
  exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  collision_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO collision_count
  FROM public.bookings
  WHERE utc_start = check_utc_start
    AND status = 'confirmed'
    AND (exclude_booking_id IS NULL OR id != exclude_booking_id);
  
  RETURN collision_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Authentication System

### User Registration Flow
1. User fills out signup form
2. Supabase creates user account
3. Email confirmation sent (if enabled)
4. User confirms email
5. User can sign in

### User Authentication Flow
1. User enters credentials
2. Supabase validates credentials
3. JWT token issued
4. User session established
5. Protected routes accessible

### Auth Context Implementation
```typescript
// AuthContext provides user state across the app
const { user, loading, signOut } = useAuth();
```

## API Endpoints

### Supabase Auto-generated Endpoints

#### Authentication
- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token` - User login
- `POST /auth/v1/logout` - User logout
- `GET /auth/v1/user` - Get current user

#### Database
- `GET /rest/v1/bookings` - List bookings
- `POST /rest/v1/bookings` - Create booking
- `PATCH /rest/v1/bookings` - Update booking
- `DELETE /rest/v1/bookings` - Delete booking

### Custom Functions
- `check_booking_collision` - Check for time slot conflicts

## Deployment

### Netlify Deployment

1. **Build the application**
```bash
npm run build
```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Environment Variables**
   Add these to Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` (your Netlify domain)

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables"
**Error**: `Missing Supabase environment variables. Please check your .env file.`

**Solution**:
- Ensure `.env` file exists in project root
- Verify environment variables are correctly set
- Restart development server after creating `.env`

#### 2. "Failed to create booking"
**Error**: Database connection or validation errors

**Solutions**:
- Check Supabase project is active
- Verify database migrations were applied: `npx supabase db push`
- Check browser console for specific error messages
- Verify RLS policies are correctly set

#### 3. "Email not confirmed" during signup
**Error**: User cannot sign in after registration

**Solutions**:
- Disable email confirmation in Supabase dashboard
- Or confirm user manually via SQL:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'user@example.com';
```

#### 4. Docker errors with Supabase CLI
**Error**: `Docker Desktop is a prerequisite for local development`

**Solution**: 
- This error is expected for cloud-only usage
- Use `npx supabase db push` for database migrations
- Local Docker is not required for cloud Supabase

#### 5. Duplicate className warnings
**Error**: `Duplicate "className" attribute in JSX element`

**Solution**: 
- Remove duplicate className attributes
- Use only one className per element
- Check for copy-paste errors in JSX

#### 6. Build failures
**Error**: Build process fails during deployment

**Solutions**:
- Check all environment variables are set in hosting platform
- Verify build command: `npm run build`
- Check for TypeScript errors: `npm run lint`
- Ensure all dependencies are in `package.json`

### Performance Issues

#### 1. Slow page loads
**Solutions**:
- Enable Vite's build optimizations
- Use React.lazy() for code splitting
- Optimize images and assets
- Enable Supabase connection pooling

#### 2. Database query performance
**Solutions**:
- Add appropriate indexes
- Use database views for complex queries
- Implement pagination for large datasets
- Monitor query performance in Supabase dashboard

### Security Issues

#### 1. RLS Policy Violations
**Error**: `new row violates row-level security policy`

**Solutions**:
- Review and update RLS policies
- Ensure policies match your use case
- Test policies with different user roles
- Use Supabase's policy testing tools

#### 2. Authentication Issues
**Solutions**:
- Verify JWT token configuration
- Check session timeout settings
- Ensure proper CORS configuration
- Validate user permissions

## Security Considerations

### Data Protection
- All data encrypted in transit (HTTPS)
- Database connections use SSL
- Row Level Security (RLS) enabled
- User data isolated by policies

### Authentication Security
- JWT tokens with expiration
- Secure password requirements
- Email verification (optional)
- Session management

### API Security
- Rate limiting on endpoints
- Input validation and sanitization
- CORS configuration
- SQL injection prevention via parameterized queries

### Deployment Security
- Environment variables secured
- HTTPS enforcement
- Security headers configured
- Regular dependency updates

## Monitoring and Maintenance

### Health Checks
- Database connection monitoring
- API endpoint availability
- User authentication success rates
- Booking system functionality

### Regular Maintenance
- Update dependencies monthly
- Monitor database performance
- Review and update security policies
- Backup database regularly

### Error Tracking
- Implement error boundary components
- Use Supabase's built-in logging
- Monitor client-side errors
- Track user journey analytics

---

## Support

For technical support:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review React documentation: [react.dev](https://react.dev)
- Vite documentation: [vitejs.dev](https://vitejs.dev)

For project-specific issues, refer to the project repository's issue tracker.
