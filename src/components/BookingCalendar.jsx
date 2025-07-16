import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { getAvailableTimes } from '../services/bookingApi';
import { motion, AnimatePresence } from 'framer-motion';

const BookingCalendar = ({ serviceType, onSelectDateTime }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(0);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Check if date is available (not in the past, not weekend)
  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    if (date < today) return false;
    
    // Check if date is weekend (optional - remove if you offer weekend appointments)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;
    
    // Check if date is within 3 months
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (date > maxDate) return false;
    
    return true;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setAvailableSlots([]);
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setAvailableSlots([]);
  };

  // Handle date selection
  const handleDateSelect = async (date) => {
    if (!isDateAvailable(date)) return;
    
    setSelectedDate(date);
    setIsLoading(true);
    
    try {
      // In mock mode, generate fake available times
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock available times
        const mockSlots = [];
        const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];
        
        times.forEach(time => {
          if (Math.random() > 0.3) { // 70% chance slot is available
            mockSlots.push({
              time,
              datetime: `${date.toISOString().split('T')[0]}T${time}:00`
            });
          }
        });
        
        setAvailableSlots(mockSlots);
      } else {
        // Real API call
        const dateStr = date.toISOString().split('T')[0];
        const slots = await getAvailableTimes(dateStr, serviceType);
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error('Error fetching available times:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle time selection
  const handleTimeSelect = (slot) => {
    onSelectDateTime({
      date: selectedDate,
      time: slot.time,
      datetime: slot.datetime
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const monthVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select a Date
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
                disabled={currentMonth <= new Date()}
                className="transition-all hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 font-medium min-w-[150px] text-center">
                {monthYear}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
                className="transition-all hover:scale-105"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative pt-6">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentMonth.toString()}
              custom={direction}
              variants={monthVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-7 gap-1"
            >
              {days.map((date, index) => {
                const isAvailable = isDateAvailable(date);
                const isSelected = selectedDate && date && 
                  selectedDate.toDateString() === date.toDateString();
                const isToday = date && date.toDateString() === new Date().toDateString();
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => date && handleDateSelect(date)}
                    disabled={!isAvailable}
                    whileHover={isAvailable ? { scale: 1.05 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    className={`
                      p-3 text-sm rounded-lg transition-all duration-200 relative
                      ${!date ? 'invisible' : ''}
                      ${isAvailable 
                        ? 'hover:bg-primary/10 cursor-pointer hover:shadow-md' 
                        : 'text-gray-300 cursor-not-allowed'}
                      ${isSelected 
                        ? 'bg-primary text-white hover:bg-primary shadow-lg ring-2 ring-primary/20' 
                        : ''}
                      ${isToday && !isSelected
                        ? 'font-bold text-primary ring-1 ring-primary/30'
                        : ''}
                    `}
                  >
                    {date?.getDate()}
                    {isToday && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Available Times for {formatDate(selectedDate)}
                  {availableSlots.length > 0 && (
                    <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-200 rounded-md animate-pulse"
                      />
                    ))}
                  </div>
                ) : availableSlots.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, staggerChildren: 0.05 }}
                  >
                    {availableSlots.map((slot, index) => (
                      <motion.div
                        key={slot.time}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handleTimeSelect(slot)}
                          className="w-full hover:bg-primary hover:text-white hover:scale-105 transition-all duration-200 hover:shadow-md"
                        >
                          {new Date(`2000-01-01T${slot.time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">
                      No available times for this date. Please select another date.
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingCalendar;
