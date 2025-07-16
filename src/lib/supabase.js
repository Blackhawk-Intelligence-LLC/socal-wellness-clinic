import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials not found! Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel environment variables');
  // Create a mock client to prevent crashes
  supabase = {
    auth: {
      signUp: async () => ({ error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: new Error('Supabase not configured') }),
      resetPasswordForEmail: async () => ({ error: new Error('Supabase not configured') }),
      getSession: async () => ({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: async () => ({ data: [], error: new Error('Supabase not configured') }),
      insert: async () => ({ error: new Error('Supabase not configured') }),
      update: async () => ({ error: new Error('Supabase not configured') }),
      delete: async () => ({ error: new Error('Supabase not configured') }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export { supabase };

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