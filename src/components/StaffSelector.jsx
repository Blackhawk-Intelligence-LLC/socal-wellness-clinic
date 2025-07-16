import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, Award, AlertCircle, Users } from 'lucide-react';
import { staffService } from '../services/staffService';

const StaffSelector = ({ 
  serviceType, 
  date, 
  time, 
  onSelectStaff,
  selectedStaffId,
  genderPreference: patientGenderPref 
}) => {
  const [availableStaff, setAvailableStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceGenderPref, setServiceGenderPref] = useState(null);
  const [showGenderPreference, setShowGenderPreference] = useState(false);

  useEffect(() => {
    if (serviceType && date && time) {
      fetchAvailableStaff();
    }
  }, [serviceType, date, time, patientGenderPref]);

  const fetchAvailableStaff = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error, genderPreference } = await staffService.getAvailableStaff(
        serviceType,
        date,
        time,
        patientGenderPref
      );

      if (error) throw error;

      setAvailableStaff(data || []);
      setServiceGenderPref(genderPreference);
      
      // Show gender preference selector if service allows patient choice
      if (genderPreference?.gender_preference === 'patient_choice') {
        setShowGenderPreference(true);
      }
    } catch (err) {
      console.error('Error fetching available staff:', err);
      setError('Unable to load available staff. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'nurse': 'RN',
      'nurse_practitioner': 'NP',
      'physician_assistant': 'PA',
      'doctor': 'MD',
      'technician': 'Tech'
    };
    return roleMap[role] || role;
  };

  const getGenderDisplay = (gender) => {
    return gender?.charAt(0).toUpperCase() + gender?.slice(1) || 'Not specified';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading available staff...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-8">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Select Your Provider
        </CardTitle>
        {serviceGenderPref?.notes && (
          <p className="text-sm text-gray-600 mt-1">{serviceGenderPref.notes}</p>
        )}
      </CardHeader>
      <CardContent>
        {showGenderPreference && !patientGenderPref && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-blue-50 rounded-lg"
          >
            <p className="text-sm font-medium text-blue-900 mb-2">
              Would you prefer a specific provider gender?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectStaff(null, { genderPreference: 'male' })}
              >
                Male Provider
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectStaff(null, { genderPreference: 'female' })}
              >
                Female Provider
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectStaff(null, { genderPreference: 'no_preference' })}
              >
                No Preference
              </Button>
            </div>
          </motion.div>
        )}

        {availableStaff.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">
              No providers available for this time slot.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please select a different date or time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              {availableStaff.length} provider{availableStaff.length !== 1 ? 's' : ''} available
            </p>
            
            <AnimatePresence>
              {availableStaff.map((staff, index) => (
                <motion.div
                  key={staff.staff_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedStaffId === staff.staff_id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => onSelectStaff(staff.staff_id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#001E40]/10 to-[#5B8FA8]/10 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-[#001E40]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {staff.first_name} {staff.last_name}, {getRoleDisplay(staff.role)}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {getGenderDisplay(staff.gender)} • {staff.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            {staff.specializations?.length > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <Award className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-500">
                                  {staff.specializations.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {selectedStaffId === staff.staff_id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                Your selected provider will be reserved for your appointment time. If you have no preference, we'll assign the most suitable available provider.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffSelector; 