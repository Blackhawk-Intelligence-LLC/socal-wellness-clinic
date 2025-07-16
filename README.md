# SoCal Wellness Clinic 🏥

A modern, full-featured medical wellness clinic website with appointment booking, user authentication, and account management.

![SoCal Wellness Clinic](https://img.shields.io/badge/React-19.0.0-blue) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green) ![Vite](https://img.shields.io/badge/Vite-6.0.5-purple)

## 🚀 Features

### Core Features
- **Modern Design**: Beautiful, responsive UI with smooth animations
- **User Authentication**: Secure sign up/sign in with email verification
- **Smart Booking System**: 
  - Visual calendar with available dates
  - Time slot selection with real-time availability
  - 3-step booking flow with progress indicators
  - Appointment confirmation with unique codes
- **Account Management**: User dashboard for managing appointments
- **Service Catalog**: 8 specialized wellness services
- **HIPAA Compliant**: Secure data handling and privacy

### Technical Features
- **Supabase Integration**: 
  - Authentication with email verification
  - PostgreSQL database with RLS
  - Real-time appointment updates
- **Acuity Scheduling API**: Ready for live appointment scheduling
- **Responsive Design**: Works perfectly on all devices
- **SEO Optimized**: Meta tags and semantic HTML
- **Performance**: Lightning fast with Vite and code splitting

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Supabase (Auth + Database)
- **Scheduling**: Acuity Scheduling API integration
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Acuity Scheduling account (optional, for live bookings)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/socal-wellness-clinic.git
   cd socal-wellness-clinic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Update `.env.local` with your credentials**
   ```env
   # Supabase (Required)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Acuity (Optional - uses mock data if not set)
   VITE_ACUITY_USER_ID=your_acuity_user_id
   VITE_ACUITY_API_KEY=your_acuity_api_key
   VITE_USE_MOCK_API=false
   ```

## 🗄️ Database Setup

1. **Create a Supabase project** at [app.supabase.com](https://app.supabase.com)

2. **Run the database schema**
   - Go to SQL Editor in Supabase
   - Copy contents of `supabase/schema.sql`
   - Execute the query

3. **Verify RLS is enabled** on all tables

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## 🚀 Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## 📱 Features Walkthrough

### 1. User Registration
- Click "Book Appointment" → "Sign up"
- Fill in your details
- Verify email to activate account

### 2. Booking Flow
- Sign in to your account
- Navigate to booking form
- Step 1: Enter personal info & select service
- Step 2: Choose date and time from calendar
- Step 3: Review and confirm booking
- Receive confirmation code

### 3. Account Management
- View upcoming appointments
- Cancel or reschedule bookings
- Update profile information
- View appointment history

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard

### Manual Build

```bash
npm run build
# Serve the 'dist' folder with any static host
```

## 📂 Project Structure

```
socal-wellness-clinic/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.jsx    # Navigation with auth
│   │   ├── Hero.jsx      # Landing section
│   │   ├── Services.jsx  # Service catalog
│   │   ├── Contact.jsx   # Booking form
│   │   ├── AuthModal.jsx # Authentication
│   │   └── ...
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── services/         # API services
│   │   ├── bookingApi.js
│   │   └── supabaseBooking.js
│   ├── lib/             # Utilities
│   │   ├── supabase.js
│   │   └── utils.js
│   └── App.jsx          # Main app component
├── supabase/
│   └── schema.sql       # Database schema
├── public/              # Static assets
└── ...config files
```

## 🔒 Security

- All user data is encrypted at rest
- Row Level Security (RLS) ensures data isolation
- HIPAA-compliant data handling
- Secure authentication with email verification
- API keys are never exposed to frontend

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Supabase](https://supabase.com/) for backend infrastructure
- [Acuity Scheduling](https://acuityscheduling.com/) for appointment management
- [Vercel](https://vercel.com/) for hosting

## 📞 Support

For support, email info@doctorsweightclinics.com or call 619-476-0060.

---

Built with ❤️ by [Your Name] for SoCal Wellness Clinic