import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Mail, MapPin, Clock, Calendar, AlertCircle, CheckCircle, ChevronRight, User, Stethoscope } from 'lucide-react';
import { createAppointment, mockCreateAppointment, SERVICE_TYPES } from '../services/bookingApi';
import { bookingService } from '../services/supabaseBooking';
import BookingCalendar from './BookingCalendar';
import StaffSelector from './StaffSelector';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: 'Medical Weight Loss',
    date: '',
    time: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [confirmationCode, setConfirmationCode] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Service & Info, 2: Date & Time, 3: Provider, 4: Review
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [staffGenderPreference, setStaffGenderPreference] = useState(null);

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "619-476-0060",
      link: "tel:619-476-0060"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@doctorsweightclinics.com",
      link: "mailto:info@doctorsweightclinics.com"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "236 3rd Avenue, Suite A, Chula Vista, CA 91910",
      link: "https://maps.google.com/?q=236+3rd+Avenue+Suite+A+Chula+Vista+CA+91910"
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon-Fri: 8:00 AM - 6:00 PM",
      link: null
    }
  ];

  // Generate time slots from 8 AM to 5 PM (last appointment at 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots.push({ value: time, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeSelect = ({ date, time, datetime }) => {
    setFormData(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0],
      time: time,
      datetime: datetime
    }));
  };

  const canProceedToStep2 = () => {
    return formData.firstName && formData.lastName && formData.email && formData.phone && formData.service;
  };

  const canProceedToStep3 = () => {
    return formData.date && formData.time;
  };

  const canProceedToStep4 = () => {
    // Staff selection is optional, so we can proceed regardless
    return true;
  };

  const handleStaffSelect = (staffId, options = {}) => {
    setSelectedStaffId(staffId);
    if (options.genderPreference) {
      setStaffGenderPreference(options.genderPreference);
      // If only setting gender preference, don't proceed yet
      if (!staffId) return;
    }
    // Auto-proceed to review if staff is selected
    if (staffId) {
      setCurrentStep(4);
    }
  };

  const steps = [
    { number: 1, title: 'Your Information', icon: User },
    { number: 2, title: 'Select Date & Time', icon: Calendar },
    { number: 3, title: 'Choose Provider', icon: Stethoscope },
    { number: 4, title: 'Review & Confirm', icon: CheckCircle }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      setAuthModalMode('signup');
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Combine date and time for the API
      const datetime = `${formData.date}T${formData.time}:00`;
      
      const appointmentData = {
        ...formData,
        datetime,
        assigned_staff_id: selectedStaffId,
        staff_gender_preference: staffGenderPreference
      };

      // Use Supabase if we have a user, otherwise use mock/Acuity
      const { data, error } = await bookingService.createAppointment(appointmentData);

      if (error) throw error;

      setConfirmationCode(data.confirmation_code);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: 'Medical Weight Loss',
          date: '',
          time: '',
          message: ''
        });
        setCurrentStep(1);
        setSelectedStaffId(null);
        setStaffGenderPreference(null);
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
                      <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#001E40] to-[#012650] bg-clip-text text-transparent">Start Your Transformation Today</span>
          </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book your consultation online or contact us directly. We're here to help you achieve your wellness goals.
            </p>
          </motion.div>

          <div ref={ref} className="grid lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <CardContent className="p-8">
                  {/* Step Indicator */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                          <div className="flex items-center">
                            <motion.div 
                              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                currentStep >= step.number 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                              animate={{
                                scale: currentStep === step.number ? 1.1 : 1,
                              }}
                            >
                              <step.icon className="h-5 w-5" />
                            </motion.div>
                            <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                              currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.title}
                            </span>
                          </div>
                          {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                              currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                            }`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold mb-6 text-[#001E40]">Book Your Consultation</h3>
                  
                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-800">Appointment Confirmed!</p>
                        <p className="text-green-700">Your confirmation code is: <span className="font-mono font-bold">{confirmationCode}</span></p>
                        <p className="text-sm text-green-600 mt-1">
                          We'll send you a confirmation email with all the details.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800">Booking Failed</p>
                        <p className="text-red-700">
                          Please try again or call us at 619-476-0060 to book by phone.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      {/* Step 1: Personal Information & Service Selection */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">First Name</label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="John"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Last Name</label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Doe"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                              placeholder="john@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                              placeholder="(619) 555-0123"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                              <Stethoscope className="h-4 w-4" />
                              Service of Interest
                            </label>
                            <select
                              name="service"
                              value={formData.service}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                              {Object.keys(SERVICE_TYPES).map(service => (
                                <option key={service} value={service}>
                                  {service} ({SERVICE_TYPES[service].duration} min)
                                </option>
                              ))}
                            </select>
                          </div>

                          <Button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            disabled={!canProceedToStep2()}
                            className="w-full flex items-center justify-center gap-2"
                          >
                            Next: Select Date & Time
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}

                      {/* Step 2: Date & Time Selection */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-4"
                        >
                          <BookingCalendar
                            serviceType={formData.service}
                            onSelectDateTime={handleDateTimeSelect}
                          />

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCurrentStep(1)}
                              className="flex-1"
                            >
                              Back
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setCurrentStep(3)}
                              disabled={!canProceedToStep3()}
                              className="flex-1 flex items-center justify-center gap-2"
                            >
                              Select Provider
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Provider Selection */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-4"
                        >
                          <StaffSelector
                            serviceType={formData.service}
                            date={formData.date}
                            time={formData.time}
                            onSelectStaff={handleStaffSelect}
                            selectedStaffId={selectedStaffId}
                            genderPreference={staffGenderPreference}
                          />

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCurrentStep(2)}
                              className="flex-1"
                            >
                              Back
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setCurrentStep(4)}
                              disabled={!canProceedToStep4()}
                              className="flex-1 flex items-center justify-center gap-2"
                            >
                              Review Booking
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Review & Confirm */}
                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-4"
                        >
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h4 className="font-semibold text-lg mb-3">Review Your Appointment</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">{formData.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{formData.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Service:</span>
                                <span className="font-medium">{formData.service}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">
                                  {new Date(formData.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Time:</span>
                                <span className="font-medium">
                                  {new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Additional Message (Optional)</label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                              placeholder="Any specific concerns or questions?"
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCurrentStep(3)}
                              className="flex-1"
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="flex-1"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Booking...
                                </>
                              ) : (
                                'Confirm Booking'
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Contact Cards */}
              <div className="grid grid-cols-2 gap-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Icon className="h-8 w-8 text-primary mb-3" />
                        <h4 className="font-semibold mb-1">{info.title}</h4>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 hover:text-primary transition-colors"
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{info.content}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Map */}
              <Card className="overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3358.7844037658474!2d-117.08466288881593!3d32.665179173607486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d9535e3e2c8f5b%3A0x8f4d9c0d3b8e8a7d!2s236%203rd%20Ave%20Suite%20A%2C%20Chula%20Vista%2C%20CA%2091910!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Doctors Weight Clinics Location"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auth Modal for booking */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          // After successful auth, user can continue with booking
          setShowAuthModal(false);
        }}
      />
    </>
  );
};

export default Contact;
