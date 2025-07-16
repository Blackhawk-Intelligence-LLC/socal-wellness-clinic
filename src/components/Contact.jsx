import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
      content: "info@socalwellness.com",
      link: "mailto:info@socalwellness.com"
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Start Your Transformation Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take the first step towards a healthier, happier you. Contact us to schedule your consultation.
          </p>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6">Request a Consultation</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service of Interest</label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>Medical Weight Loss</option>
                      <option>IV Therapy</option>
                      <option>Anti-Aging</option>
                      <option>PRP Hair Restoration</option>
                      <option>Hormone Replacement</option>
                      <option>Cellulite Z Wave</option>
                      <option>Erectile Dysfunction</option>
                      <option>NAD+ Therapy</option>
                      <option>Other/Multiple Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Schedule Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Map */}
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
                title="SoCal Wellness Location"
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;