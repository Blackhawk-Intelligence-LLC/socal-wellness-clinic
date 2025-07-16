-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  confirmation_code TEXT UNIQUE NOT NULL,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Add indexes for common queries
  INDEX idx_appointments_user_id (user_id),
  INDEX idx_appointments_datetime (datetime),
  INDEX idx_appointments_status (status),
  INDEX idx_appointments_confirmation_code (confirmation_code)
);

-- Create appointment_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.appointment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'cancelled', 'completed', 'rescheduled')),
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create services table for dynamic service management
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default services
INSERT INTO public.services (name, description, duration_minutes, sort_order) VALUES
  ('Medical Weight Loss', 'Personalized weight loss programs with FDA-approved medications', 60, 1),
  ('IV Therapy', 'Revitalize with custom IV nutrient infusions', 45, 2),
  ('Anti-Aging', 'Advanced treatments to rejuvenate and restore', 60, 3),
  ('PRP Hair Restoration', 'Natural hair regrowth using platelet-rich plasma', 90, 4),
  ('Hormone Replacement', 'Optimize your hormones for better energy and vitality', 60, 5),
  ('Cellulite Z Wave', 'Non-invasive cellulite reduction treatment', 45, 6),
  ('Erectile Dysfunction', 'Discreet, effective treatments for intimate wellness', 60, 7),
  ('NAD+ Therapy', 'Cutting-edge cellular regeneration therapy', 120, 8),
  ('Other/Multiple Services', 'Consultation for multiple or other services', 60, 9)
ON CONFLICT (name) DO NOTHING;

-- Create RLS (Row Level Security) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- Appointment history policies
CREATE POLICY "Users can view own appointment history" ON public.appointment_history
  FOR SELECT USING (auth.uid() = user_id);

-- Services policies (public read)
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to log appointment changes
CREATE OR REPLACE FUNCTION public.log_appointment_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.appointment_history (appointment_id, user_id, action, changes)
    VALUES (NEW.id, NEW.user_id, 'created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.appointment_history (appointment_id, user_id, action, changes)
    VALUES (NEW.id, NEW.user_id, 
      CASE 
        WHEN OLD.status != NEW.status AND NEW.status = 'cancelled' THEN 'cancelled'
        WHEN OLD.status != NEW.status AND NEW.status = 'completed' THEN 'completed'
        WHEN OLD.datetime != NEW.datetime THEN 'rescheduled'
        ELSE 'updated'
      END,
      jsonb_build_object(
        'old', to_jsonb(OLD),
        'new', to_jsonb(NEW)
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for appointment history
CREATE TRIGGER log_appointment_changes
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.log_appointment_change();

-- Create views for easier querying
CREATE OR REPLACE VIEW public.upcoming_appointments AS
SELECT 
  a.*,
  s.name as service_name,
  s.duration_minutes,
  p.first_name as profile_first_name,
  p.last_name as profile_last_name
FROM public.appointments a
LEFT JOIN public.services s ON s.name = a.service_type
LEFT JOIN public.profiles p ON p.id = a.user_id
WHERE a.datetime >= NOW()
  AND a.status IN ('pending', 'confirmed')
ORDER BY a.datetime ASC;

-- Grant permissions on the view
GRANT SELECT ON public.upcoming_appointments TO authenticated; 