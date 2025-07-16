import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types for TypeScript (optional but helpful)
export const TABLES = {
  APPOINTMENTS: 'appointments',
  PROFILES: 'profiles',
  STAFF: 'staff',
  STAFF_SERVICES: 'staff_services',
  STAFF_AVAILABILITY: 'staff_availability',
  STAFF_TIME_OFF: 'staff_time_off',
  SERVICE_GENDER_PREFERENCES: 'service_gender_preferences',
};

// Appointment status enum
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}; 