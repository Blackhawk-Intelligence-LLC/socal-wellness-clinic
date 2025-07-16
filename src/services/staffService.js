import { supabase } from '../lib/supabase';

export const staffService = {
  // Get all active staff
  async getAllStaff() {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          staff_services (
            service_id,
            is_certified,
            services (
              id,
              name,
              duration_minutes
            )
          ),
          staff_availability (
            day_of_week,
            start_time,
            end_time,
            is_available
          )
        `)
        .eq('is_active', true)
        .order('last_name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching staff:', error);
      return { data: null, error };
    }
  },

  // Get available staff for a specific service and time
  async getAvailableStaff(serviceType, date, time, genderPreference = null) {
    try {
      // First, get service details and gender preferences
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          service_gender_preferences (
            gender_preference,
            is_strict
          )
        `)
        .eq('name', serviceType)
        .single();

      if (serviceError) throw serviceError;

      // Call the database function to get available staff
      const { data, error } = await supabase
        .rpc('get_available_staff', {
          service_name: serviceType,
          appointment_date: date,
          appointment_time: time,
          duration_minutes: service.duration_minutes,
          gender_preference: genderPreference
        });

      if (error) throw error;

      // If service has strict gender requirements, filter results
      const genderPref = service.service_gender_preferences?.[0];
      if (genderPref?.is_strict && genderPref.gender_preference !== 'any') {
        const filteredData = data.filter(staff => {
          if (genderPref.gender_preference === 'male_only') {
            return staff.gender === 'male';
          } else if (genderPref.gender_preference === 'female_only') {
            return staff.gender === 'female';
          }
          return true;
        });
        return { data: filteredData, error: null, genderPreference: genderPref };
      }

      return { data, error: null, genderPreference: genderPref };
    } catch (error) {
      console.error('Error fetching available staff:', error);
      return { data: null, error };
    }
  },

  // Get staff member by ID
  async getStaffById(staffId) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          staff_services (
            service_id,
            is_certified,
            certification_date,
            certification_expiry,
            services (
              id,
              name,
              duration_minutes
            )
          ),
          staff_availability (
            id,
            day_of_week,
            start_time,
            end_time,
            is_available
          )
        `)
        .eq('id', staffId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching staff member:', error);
      return { data: null, error };
    }
  },

  // Create new staff member
  async createStaff(staffData) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating staff member:', error);
      return { data: null, error };
    }
  },

  // Update staff member
  async updateStaff(staffId, updates) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', staffId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating staff member:', error);
      return { data: null, error };
    }
  },

  // Assign service to staff member
  async assignService(staffId, serviceId, certificationData = {}) {
    try {
      const { data, error } = await supabase
        .from('staff_services')
        .insert({
          staff_id: staffId,
          service_id: serviceId,
          ...certificationData
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error assigning service:', error);
      return { data: null, error };
    }
  },

  // Remove service from staff member
  async removeService(staffId, serviceId) {
    try {
      const { error } = await supabase
        .from('staff_services')
        .delete()
        .eq('staff_id', staffId)
        .eq('service_id', serviceId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error removing service:', error);
      return { error };
    }
  },

  // Set staff availability
  async setAvailability(staffId, availability) {
    try {
      // Delete existing availability for the staff member
      await supabase
        .from('staff_availability')
        .delete()
        .eq('staff_id', staffId);

      // Insert new availability
      const { data, error } = await supabase
        .from('staff_availability')
        .insert(
          availability.map(slot => ({
            staff_id: staffId,
            ...slot
          }))
        )
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error setting availability:', error);
      return { data: null, error };
    }
  },

  // Request time off
  async requestTimeOff(staffId, timeOffData) {
    try {
      const { data, error } = await supabase
        .from('staff_time_off')
        .insert({
          staff_id: staffId,
          ...timeOffData
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error requesting time off:', error);
      return { data: null, error };
    }
  },

  // Approve time off (admin only)
  async approveTimeOff(timeOffId, approverId) {
    try {
      const { data, error } = await supabase
        .from('staff_time_off')
        .update({
          is_approved: true,
          approved_by: approverId,
          approved_at: new Date().toISOString()
        })
        .eq('id', timeOffId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error approving time off:', error);
      return { data: null, error };
    }
  },

  // Get staff schedule for a date range
  async getStaffSchedule(staffId, startDate, endDate) {
    try {
      // Get regular availability
      const { data: availability } = await supabase
        .from('staff_availability')
        .select('*')
        .eq('staff_id', staffId)
        .eq('is_available', true);

      // Get time off in the date range
      const { data: timeOff } = await supabase
        .from('staff_time_off')
        .select('*')
        .eq('staff_id', staffId)
        .eq('is_approved', true)
        .gte('end_date', startDate)
        .lte('start_date', endDate);

      // Get appointments in the date range
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          *,
          services!inner (
            name,
            duration_minutes
          )
        `)
        .eq('assigned_staff_id', staffId)
        .in('status', ['pending', 'confirmed'])
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);

      return {
        data: {
          availability,
          timeOff,
          appointments
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching staff schedule:', error);
      return { data: null, error };
    }
  },

  // Get service gender preferences
  async getServiceGenderPreferences() {
    try {
      const { data, error } = await supabase
        .from('service_gender_preferences')
        .select(`
          *,
          services (
            id,
            name
          )
        `);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching gender preferences:', error);
      return { data: null, error };
    }
  },

  // Update service gender preference
  async updateServiceGenderPreference(serviceId, preference) {
    try {
      const { data, error } = await supabase
        .from('service_gender_preferences')
        .upsert({
          service_id: serviceId,
          ...preference
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating gender preference:', error);
      return { data: null, error };
    }
  }
}; 