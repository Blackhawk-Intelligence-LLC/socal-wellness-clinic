# Booking API Integration

This directory contains the booking API integration for appointment scheduling.

## Current Implementation

We've integrated **Acuity Scheduling** for HIPAA-compliant appointment booking. The integration includes:

- ✅ Online appointment booking
- ✅ Service-specific appointment types
- ✅ Date and time selection
- ✅ Automated confirmation codes
- ✅ Mock API for development/testing

## Setup Instructions

### 1. Get Acuity Scheduling Account

1. Sign up for Acuity Scheduling at: https://acuityscheduling.com/
2. Choose a plan that includes API access (Powerhouse plan or higher)
3. Enable HIPAA compliance in your account settings

### 2. Get API Credentials

1. Log into your Acuity account
2. Go to: **Integrations** → **API** → **API Credentials**
3. Copy your User ID and API Key

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your credentials to `.env`:
   ```
   VITE_ACUITY_USER_ID=your_user_id_here
   VITE_ACUITY_API_KEY=your_api_key_here
   VITE_USE_MOCK_API=false
   ```

### 4. Configure Appointment Types in Acuity

In your Acuity dashboard, create appointment types for each service:

1. **Medical Weight Loss** (60 min)
2. **IV Therapy** (45 min)
3. **Anti-Aging** (60 min)
4. **PRP Hair Restoration** (90 min)
5. **Hormone Replacement** (60 min)
6. **Cellulite Z Wave** (45 min)
7. **Erectile Dysfunction** (60 min)
8. **NAD+ Therapy** (120 min)

Note the ID for each appointment type and update the `SERVICE_TYPES` mapping in `bookingApi.js`.

## API Functions

### `getAvailableTimes(date, serviceType)`
Fetches available appointment slots for a specific date and service.

### `createAppointment(appointmentData)`
Creates a new appointment with patient information.

### `cancelAppointment(appointmentId)`
Cancels an existing appointment.

### `rescheduleAppointment(appointmentId, newDateTime)`
Reschedules an existing appointment.

### `mockCreateAppointment(appointmentData)`
Mock function for testing without API credentials.

## Testing

To test the booking functionality without API credentials:

1. Set `VITE_USE_MOCK_API=true` in your `.env` file
2. The mock API will simulate successful bookings with confirmation codes

## Security Notes

- Never commit `.env` files to version control
- API credentials should only be used on the backend in production
- Consider implementing a backend proxy for API calls to hide credentials
- Ensure HIPAA compliance is enabled in your Acuity account

## Alternative Booking Solutions

If you prefer a different booking system, here are alternatives:

1. **SimplyBook.me** - HIPAA compliant, good API
2. **Calendly** - Popular but needs Business plan for HIPAA
3. **Custom Google Calendar** - Free but requires building compliance
4. **Square Appointments** - Good for payment integration

## Need Help?

- Acuity API Docs: https://developers.acuityscheduling.com/
- HIPAA Compliance: https://help.acuityscheduling.com/hc/en-us/articles/219148267
