-- Staff Management Schema for SoCal Wellness Clinic
-- This schema handles staff members, their qualifications, availability, and procedure assignments

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  role TEXT NOT NULL CHECK (role IN ('nurse', 'nurse_practitioner', 'physician_assistant', 'doctor', 'technician')),
  license_number TEXT,
  hire_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  bio TEXT,
  specializations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create staff_services table (which procedures each staff member can perform)
CREATE TABLE IF NOT EXISTS public.staff_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  is_certified BOOLEAN DEFAULT true,
  certification_date DATE,
  certification_expiry DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(staff_id, service_id)
);

-- Create staff_availability table (regular weekly schedule)
CREATE TABLE IF NOT EXISTS public.staff_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(staff_id, day_of_week, start_time)
);

-- Create staff_time_off table (exceptions to regular schedule)
CREATE TABLE IF NOT EXISTS public.staff_time_off (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES public.staff(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CHECK (end_date >= start_date)
);

-- Create service_gender_preferences table
CREATE TABLE IF NOT EXISTS public.service_gender_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  gender_preference TEXT CHECK (gender_preference IN ('male_only', 'female_only', 'any', 'patient_choice')),
  is_strict BOOLEAN DEFAULT false, -- If true, must match; if false, it's a preference
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(service_id)
);

-- Update appointments table to include staff assignment
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES public.staff(id),
ADD COLUMN IF NOT EXISTS staff_gender_preference TEXT CHECK (staff_gender_preference IN ('male', 'female', 'no_preference'));

-- Create staff_appointments view for easy querying
CREATE OR REPLACE VIEW public.staff_appointments AS
SELECT 
  a.*,
  s.first_name as staff_first_name,
  s.last_name as staff_last_name,
  s.gender as staff_gender,
  s.role as staff_role,
  sv.name as service_name
FROM public.appointments a
LEFT JOIN public.staff s ON s.id = a.assigned_staff_id
LEFT JOIN public.services sv ON sv.name = a.service_type
WHERE a.status IN ('pending', 'confirmed')
ORDER BY a.datetime ASC;

-- Create function to get available staff for a service at a specific time
CREATE OR REPLACE FUNCTION public.get_available_staff(
  service_name TEXT,
  appointment_date DATE,
  appointment_time TIME,
  duration_minutes INTEGER DEFAULT 60,
  gender_preference TEXT DEFAULT NULL
)
RETURNS TABLE (
  staff_id UUID,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    s.id,
    s.first_name,
    s.last_name,
    s.gender,
    s.role
  FROM public.staff s
  INNER JOIN public.staff_services ss ON s.id = ss.staff_id
  INNER JOIN public.services srv ON ss.service_id = srv.id
  LEFT JOIN public.staff_availability sa ON s.id = sa.staff_id 
    AND sa.day_of_week = EXTRACT(DOW FROM appointment_date)
    AND sa.is_available = true
  WHERE 
    s.is_active = true
    AND srv.name = service_name
    AND ss.is_certified = true
    AND (
      -- Check regular availability
      appointment_time >= sa.start_time 
      AND (appointment_time + (duration_minutes || ' minutes')::INTERVAL) <= sa.end_time
    )
    AND NOT EXISTS (
      -- Check time off
      SELECT 1 FROM public.staff_time_off sto
      WHERE sto.staff_id = s.id
      AND sto.is_approved = true
      AND appointment_date BETWEEN sto.start_date AND sto.end_date
    )
    AND NOT EXISTS (
      -- Check conflicting appointments
      SELECT 1 FROM public.appointments a
      WHERE a.assigned_staff_id = s.id
      AND a.status IN ('pending', 'confirmed')
      AND a.appointment_date = appointment_date
      AND (
        (appointment_time >= a.appointment_time::TIME 
         AND appointment_time < (a.appointment_time + (
           SELECT srv2.duration_minutes || ' minutes'
           FROM public.services srv2 
           WHERE srv2.name = a.service_type
         )::INTERVAL)::TIME)
        OR
        ((appointment_time + (duration_minutes || ' minutes')::INTERVAL)::TIME > a.appointment_time::TIME
         AND appointment_time < a.appointment_time::TIME)
      )
    )
    AND (
      gender_preference IS NULL 
      OR s.gender = gender_preference
      OR gender_preference = 'no_preference'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_gender_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Staff can view all active staff
CREATE POLICY "Anyone can view active staff" ON public.staff
  FOR SELECT USING (is_active = true);

-- Staff can view their own full profile
CREATE POLICY "Staff can view own profile" ON public.staff
  FOR SELECT USING (auth.uid()::TEXT = id::TEXT);

-- Only admins can insert/update/delete staff
CREATE POLICY "Admins can manage staff" ON public.staff
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.is_admin = true
    )
  );

-- Service assignments visible to all
CREATE POLICY "Anyone can view staff services" ON public.staff_services
  FOR SELECT USING (true);

-- Availability visible to all
CREATE POLICY "Anyone can view staff availability" ON public.staff_availability
  FOR SELECT USING (true);

-- Staff can view their own time off
CREATE POLICY "Staff can view own time off" ON public.staff_time_off
  FOR SELECT USING (staff_id = auth.uid()::UUID);

-- Service gender preferences visible to all
CREATE POLICY "Anyone can view service gender preferences" ON public.service_gender_preferences
  FOR SELECT USING (true);

-- Create triggers for updated_at
CREATE TRIGGER set_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_staff_availability_updated_at
  BEFORE UPDATE ON public.staff_availability
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add is_admin column to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Sample data for service gender preferences
INSERT INTO public.service_gender_preferences (service_id, gender_preference, is_strict, notes)
SELECT 
  s.id,
  CASE s.name
    WHEN 'Erectile Dysfunction' THEN 'patient_choice'
    WHEN 'Hormone Replacement' THEN 'patient_choice'
    ELSE 'any'
  END,
  false,
  CASE s.name
    WHEN 'Erectile Dysfunction' THEN 'Patients may request male or female practitioner'
    WHEN 'Hormone Replacement' THEN 'Patients may have preference based on comfort level'
    ELSE NULL
  END
FROM public.services s
ON CONFLICT (service_id) DO NOTHING;

-- Grant permissions
GRANT SELECT ON public.staff_appointments TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_staff TO authenticated; 