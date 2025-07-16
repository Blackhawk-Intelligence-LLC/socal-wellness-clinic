# Staff Management System 🏥

## Overview

The SoCal Wellness Clinic staff management system provides comprehensive functionality for managing healthcare providers, their schedules, qualifications, and patient assignments. This system ensures patients can book appointments with qualified staff while respecting gender preferences and availability constraints.

## Features

### 1. **Staff Profiles**
- Complete staff information (name, role, gender, contact)
- Professional qualifications and license numbers
- Specializations and certifications
- Active/inactive status management

### 2. **Service Assignments**
Each staff member can be certified for specific procedures:
- Track certification dates and expiry
- Ensure only qualified staff perform procedures
- Manage multiple service certifications per staff

### 3. **Availability Management**
- **Regular Schedule**: Weekly recurring availability
- **Time Off**: Vacation and sick leave management
- **Real-time Conflicts**: Prevent double-booking
- **Flexible Hours**: Different schedules per day

### 4. **Gender Preferences**
For sensitive procedures:
- **Service-level Preferences**: Define gender requirements per service
- **Patient Choice**: Allow patients to select preferred provider gender
- **Strict vs. Preference**: Enforce requirements or allow flexibility

### 5. **Smart Booking Integration**
- Shows only available staff during booking
- Filters by service qualifications
- Respects gender preferences
- Auto-assigns if no preference selected

## Database Schema

### Tables Created:

1. **`staff`** - Core staff information
2. **`staff_services`** - Service certifications
3. **`staff_availability`** - Weekly schedules
4. **`staff_time_off`** - Leave management
5. **`service_gender_preferences`** - Gender requirements

### Key Functions:

- `get_available_staff()` - Real-time availability checking
- `staff_appointments` view - Easy appointment overview

## Implementation

### 1. Run the Database Schema
```sql
-- In Supabase SQL Editor
-- Run the contents of supabase/staff-schema.sql
```

### 2. Add Sample Staff (Optional)
```sql
-- Example: Add a nurse practitioner
INSERT INTO public.staff (
  email, first_name, last_name, gender, role, license_number
) VALUES (
  'jane.doe@socalwellness.com',
  'Jane',
  'Doe',
  'female',
  'nurse_practitioner',
  'NP123456'
);

-- Certify for services
INSERT INTO public.staff_services (staff_id, service_id)
SELECT 
  s.id as staff_id,
  srv.id as service_id
FROM public.staff s
CROSS JOIN public.services srv
WHERE s.email = 'jane.doe@socalwellness.com'
AND srv.name IN ('Medical Weight Loss', 'IV Therapy', 'Anti-Aging');

-- Set availability (Mon-Fri 9-5)
INSERT INTO public.staff_availability (staff_id, day_of_week, start_time, end_time)
SELECT 
  id,
  generate_series(1, 5), -- Monday to Friday
  '09:00:00'::time,
  '17:00:00'::time
FROM public.staff
WHERE email = 'jane.doe@socalwellness.com';
```

### 3. Patient Booking Flow

The booking process now includes provider selection:

1. **Step 1**: Patient information & service selection
2. **Step 2**: Date & time selection
3. **Step 3**: Provider selection (NEW)
   - Shows available providers
   - Displays gender if relevant
   - Allows patient preference selection
4. **Step 4**: Review & confirm

### 4. Admin Features (Coming Soon)

Future enhancements will include:
- Staff schedule management dashboard
- Time-off approval workflow
- Service certification tracking
- Performance analytics

## API Usage

### Get Available Staff
```javascript
import { staffService } from './services/staffService';

// Get available staff for a service
const { data, error } = await staffService.getAvailableStaff(
  'Medical Weight Loss',  // service
  '2024-01-20',          // date
  '14:00',               // time
  'female'               // gender preference (optional)
);
```

### Manage Staff
```javascript
// Create new staff member
const { data } = await staffService.createStaff({
  email: 'john.smith@clinic.com',
  first_name: 'John',
  last_name: 'Smith',
  gender: 'male',
  role: 'nurse',
  license_number: 'RN789012'
});

// Assign service certification
await staffService.assignService(staffId, serviceId, {
  certification_date: '2024-01-01',
  certification_expiry: '2025-01-01'
});

// Set weekly availability
await staffService.setAvailability(staffId, [
  { day_of_week: 1, start_time: '08:00', end_time: '16:00' },
  { day_of_week: 2, start_time: '08:00', end_time: '16:00' },
  // ... more days
]);
```

## Gender Preference Configuration

### Service Examples:

1. **Erectile Dysfunction** - Patient choice
   - Patients can request male or female provider
   - Not strictly enforced

2. **Hormone Replacement** - Patient choice
   - Based on patient comfort level
   - Flexible assignment

3. **General Services** - Any provider
   - No gender restrictions
   - Based on availability only

### Updating Preferences:
```javascript
await staffService.updateServiceGenderPreference(serviceId, {
  gender_preference: 'patient_choice',
  is_strict: false,
  notes: 'Patients may request specific gender'
});
```

## Security & Privacy

- **Row Level Security**: Staff can only view their own full details
- **Admin Access**: Only admins can manage staff records
- **HIPAA Compliance**: All patient preferences are encrypted
- **Audit Trail**: All changes are logged

## Troubleshooting

### No Available Staff
- Check staff certifications for the service
- Verify availability for the selected day/time
- Ensure no conflicting appointments
- Check time-off requests

### Gender Preference Not Working
- Verify service gender preferences are set
- Check if preference is strict or flexible
- Ensure staff gender is properly recorded

### Double Booking Issues
- Check the `get_available_staff()` function
- Verify appointment conflict detection
- Review timezone handling

## Future Enhancements

1. **Skill Levels**: Track experience levels per service
2. **Patient Preferences**: Remember preferred providers
3. **Team Scheduling**: Procedures requiring multiple staff
4. **Performance Metrics**: Track appointment success rates
5. **Mobile App**: Staff can manage their own schedules

---

This staff management system ensures your clinic operates efficiently while providing patients with the best possible care experience. 🏥✨ 