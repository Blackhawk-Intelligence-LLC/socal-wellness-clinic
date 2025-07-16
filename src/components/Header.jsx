import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, User, Calendar, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookAppointment = () => {
    if (user) {
      // Scroll to contact section if user is logged in
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Show auth modal if user is not logged in
      setAuthModalMode('signup');
      setIsAuthModalOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const handleNavClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', href: '#home', sectionId: 'home' },
    { label: 'About', href: '#about', sectionId: 'about' },
    { label: 'Services', href: '#services', sectionId: 'services' },
    { label: 'Reviews', href: '#reviews', sectionId: 'reviews' },
    { label: 'FAQ', href: '#faq', sectionId: 'faq' },
    { label: 'Contact', href: '#contact', sectionId: 'contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md' 
            : 'bg-gradient-to-b from-[#001E40]/10 to-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 md:h-24 lg:h-28">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="block">
                <img 
                  src={isScrolled ? "/logo/svg-logos/black.svg" : "/logo/svg-logos/white.svg"}
                  alt="SoCal Wellness Clinic"
                  className="h-16 md:h-20 lg:h-24 w-auto max-w-[280px] md:max-w-[320px] lg:max-w-[380px] object-contain transition-all duration-300"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.sectionId)}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                asChild
              >
                <a href="tel:619-476-0060">
                  <Phone className="h-4 w-4" />
                  619-476-0060
                </a>
              </Button>
              
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {user.user_metadata?.first_name || 'Account'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                      >
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            // For now, scroll to contact section where appointments are shown
                            const contactSection = document.getElementById('contact');
                            contactSection?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          My Appointments
                        </button>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            // For now, just close the menu - profile page would be implemented later
                            alert('Profile settings page coming soon!');
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Profile Settings
                        </button>
                        <div className="border-t border-gray-200 my-2" />
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAuthModalMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                >
                  Sign In
                </Button>
              )}
              
              <Button size="sm" onClick={handleBookAppointment}>
                Book Appointment
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <nav className="container mx-auto px-4 py-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.sectionId)}
                    className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                    asChild
                  >
                    <a href="tel:619-476-0060">
                      <Phone className="h-4 w-4" />
                      619-476-0060
                    </a>
                  </Button>
                  
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          // For now, scroll to contact section where appointments are shown
                          const contactSection = document.getElementById('contact');
                          contactSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        My Account
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-600"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthModalMode('signin');
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={handleBookAppointment}
                  >
                    Book Appointment
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          if (authModalMode === 'signup' || authModalMode === 'signin') {
            // After successful auth, scroll to contact section
            const contactSection = document.getElementById('contact');
            contactSection?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
    </>
  );
};

export default Header;