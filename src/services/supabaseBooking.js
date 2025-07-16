import { supabase, TABLES, APPOINTMENT_STATUS } from '../lib/supabase';

export const bookingService = {
  // Create a new appointment
  async createAppointment(appointmentData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to book an appointment');
      }

      const appointment = {
        user_id: user.id,
        service_type: appointmentData.service,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
        datetime: appointmentData.datetime,
        first_name: appointmentData.firstName,
        last_name: appointmentData.lastName,
        email: appointmentData.email,
        phone: appointmentData.phone,
        message: appointmentData.message || null,
        status: APPOINTMENT_STATUS.PENDING,
        confirmation_code: generateConfirmationCode(),
        assigned_staff_id: appointmentData.assigned_staff_id || null,
        staff_gender_preference: appointmentData.staff_gender_preference || null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .insert(appointment)
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email (this would be handled by Supabase Edge Functions)
      // For now, we'll just return the appointment data

      return { data, error: null };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { data: null, error };
    }
  },

  // Get user's appointments
  async getUserAppointments(userId, status = null) {
    try {
      let query = supabase
        .from(TABLES.APPOINTMENTS)
        .select('*')
        .eq('user_id', userId)
        .order('datetime', { ascending: true });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return { data: null, error };
    }
  },

  // Get appointment by ID
  async getAppointmentById(appointmentId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return { data: null, error };
    }
  },

  // Update appointment
  async updateAppointment(appointmentId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating appointment:', error);
      return { data: null, error };
    }
  },

  // Cancel appointment
  async cancelAppointment(appointmentId, reason = null) {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .update({
          status: APPOINTMENT_STATUS.CANCELLED,
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return { data: null, error };
    }
  },

  // Reschedule appointment
  async rescheduleAppointment(appointmentId, newDate, newTime) {
    try {
      const newDatetime = `${newDate}T${newTime}:00`;
      
      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .update({
          appointment_date: newDate,
          appointment_time: newTime,
          datetime: newDatetime,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return { data: null, error };
    }
  },

  // Get upcoming appointments count
  async getUpcomingAppointmentsCount(userId) {
    try {
      const now = new Date().toISOString();
      
      const { count, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', APPOINTMENT_STATUS.CONFIRMED)
        .gte('datetime', now);

      if (error) throw error;
      return { count, error: null };
    } catch (error) {
      console.error('Error counting appointments:', error);
      return { count: null, error };
    }
  },
};

// Helper function to generate confirmation codes
function generateConfirmationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SWC-'; // SoCal Wellness Clinic prefix
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
} 