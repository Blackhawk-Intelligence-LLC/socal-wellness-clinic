# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Database Setup
1. Create Supabase project at https://supabase.io
2. Run schema files in order:
   - `supabase/schema.sql` - Main tables and RLS policies
   - `supabase/staff-schema.sql` - Staff management tables

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `VITE_ACUITY_BASE_URL` - Acuity API endpoint
- `VITE_ACUITY_USER_ID` - Acuity user ID
- `VITE_ACUITY_API_KEY` - Acuity API key
- `VITE_ACUITY_MOCK_MODE` - Set to 'true' for development without API

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom SoCal brand colors
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Booking API**: Acuity Scheduling
- **Authentication**: Supabase Auth with email verification

### Key Architectural Patterns

1. **Component Structure**: All React components in `src/components/`, with UI primitives in `src/components/ui/`

2. **Service Layer**: API logic separated in `src/services/`:
   - `bookingApi.js` - Acuity Scheduling integration
   - `supabaseBooking.js` - Database booking operations
   - `staffService.js` - Staff management

3. **Authentication**: Global auth state managed via `AuthContext` (src/contexts/AuthContext.jsx)

4. **Booking Flow**: 3-step process:
   - Service selection → Calendar date → Time slot → Confirmation
   - Components: `BookingCalendar.jsx`, `BookingConfirmation.jsx`

5. **Brand Consistency**: Custom color system defined in:
   - `tailwind.config.js` - Tailwind color extensions
   - `src/styles/brand-colors.css` - CSS custom properties

### Database Schema

Main tables (with RLS policies):
- `services` - Wellness service catalog
- `staff` - Staff profiles and availability
- `bookings` - Appointment records
- `availability` - Staff schedule templates

### Development Workflow

1. **Path Aliases**: Use `@/` for src imports (configured in vite.config.js)

2. **Mock Mode**: Set `VITE_ACUITY_MOCK_MODE=true` for offline development

3. **Component Guidelines**:
   - Use Shadcn/ui components from `src/components/ui/`
   - Follow existing patterns for animations (Framer Motion)
   - Maintain responsive design with Tailwind classes

4. **API Integration**:
   - All Supabase operations use the client in `src/lib/supabase.js`
   - Booking API calls go through `src/services/bookingApi.js`
   - Always handle loading and error states

5. **Security Considerations**:
   - Never expose API keys in client code
   - Use Row Level Security for all database operations
   - Validate all user inputs before API calls

### Important Files
- `README.md` - Comprehensive setup and deployment guide
- `SUPABASE_SETUP.md` - Detailed database configuration
- `BOOKING_INTEGRATION.md` - Booking system architecture
- `.cursorrules` - Directory structure requirement: `/Users/carlson/Desktop/Work/{project-name}/`