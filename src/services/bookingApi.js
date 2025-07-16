// Booking API Service
// This integrates with Acuity Scheduling API for appointment management

const ACUITY_API_BASE = 'https://acuityscheduling.com/api/v1';

// These will come from environment variables in production
const ACUITY_USER_ID = import.meta.env.VITE_ACUITY_USER_ID || '';
const ACUITY_API_KEY = import.meta.env.VITE_ACUITY_API_KEY || '';

// Create base64 encoded auth string
const authString = btoa(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`);

const headers = {
  'Authorization': `Basic ${authString}`,
  'Content-Type': 'application/json',
};

// Service types mapping
export const SERVICE_TYPES = {
  'Medical Weight Loss': { id: 1, duration: 60 },
  'IV Therapy': { id: 2, duration: 45 },
  'Anti-Aging': { id: 3, duration: 60 },
  'PRP Hair Restoration': { id: 4, duration: 90 },
  'Hormone Replacement': { id: 5, duration: 60 },
  'Cellulite Z Wave': { id: 6, duration: 45 },
  'Erectile Dysfunction': { id: 7, duration: 60 },
  'NAD+ Therapy': { id: 8, duration: 120 },
  'Other/Multiple Services': { id: 9, duration: 60 }
};

// Get available appointment times
export const getAvailableTimes = async (date, serviceType) => {
  try {
    const appointmentTypeId = SERVICE_TYPES[serviceType]?.id || 1;
    const response = await fetch(
      `${ACUITY_API_BASE}/availability/times?date=${date}&appointmentTypeID=${appointmentTypeId}`,
      { headers }
    );
    
    if (!response.ok) throw new Error('Failed to fetch available times');
    return await response.json();
  } catch (error) {
    console.error('Error fetching available times:', error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${ACUITY_API_BASE}/appointments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        appointmentTypeID: SERVICE_TYPES[appointmentData.service]?.id || 1,
        datetime: appointmentData.datetime,
        firstName: appointmentData.firstName,
        lastName: appointmentData.lastName,
        email: appointmentData.email,
        phone: appointmentData.phone,
        fields: [
          {
            id: 1, // Custom field for message
            value: appointmentData.message || ''
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create appointment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Get appointment types
export const getAppointmentTypes = async () => {
  try {
    const response = await fetch(`${ACUITY_API_BASE}/appointment-types`, {
      headers
    });
    
    if (!response.ok) throw new Error('Failed to fetch appointment types');
    return await response.json();
  } catch (error) {
    console.error('Error fetching appointment types:', error);
    throw error;
  }
};

// Cancel an appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${ACUITY_API_BASE}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers
    });
    
    if (!response.ok) throw new Error('Failed to cancel appointment');
    return await response.json();
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

// Reschedule an appointment
export const rescheduleAppointment = async (appointmentId, newDateTime) => {
  try {
    const response = await fetch(`${ACUITY_API_BASE}/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ datetime: newDateTime })
    });
    
    if (!response.ok) throw new Error('Failed to reschedule appointment');
    return await response.json();
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    throw error;
  }
};

// For development/testing without API credentials
export const mockCreateAppointment = async (appointmentData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock response
  return {
    id: Math.random().toString(36).substr(2, 9),
    confirmationPage: 'https://doctorsweightclinics.com/confirmation',
    datetime: appointmentData.datetime,
    firstName: appointmentData.firstName,
    lastName: appointmentData.lastName,
    email: appointmentData.email,
    phone: appointmentData.phone,
    appointmentTypeID: SERVICE_TYPES[appointmentData.service]?.id || 1,
    duration: SERVICE_TYPES[appointmentData.service]?.duration || 60,
    confirmationCode: 'DWC-' + Math.random().toString(36).substr(2, 6).toUpperCase()
  };
};
