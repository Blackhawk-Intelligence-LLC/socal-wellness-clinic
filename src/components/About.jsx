import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Clock, Shield } from 'lucide-react';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: Users, value: "5,000+", label: "Happy Patients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Clock, value: "95%", label: "Success Rate" },
    { icon: Shield, value: "100%", label: "FDA Approved" }
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop"
                  alt="Medical professional"
                  className="rounded-2xl w-full h-64 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop"
                  alt="Medical facility"
                  className="rounded-2xl w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop"
                  alt="Patient consultation"
                  className="rounded-2xl w-full h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=500&fit=crop"
                  alt="Medical equipment"
                  className="rounded-2xl w-full h-64 object-cover"
                />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Partner in <span className="text-primary">Health & Wellness</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              At SoCal Wellness, we believe that everyone deserves to feel their best. 
              Our comprehensive approach combines cutting-edge medical treatments with 
              personalized care to help you achieve your health and wellness goals.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Located in the heart of Chula Vista, our state-of-the-art facility is 
              staffed by experienced medical professionals dedicated to providing you 
              with the highest quality care in a comfortable, welcoming environment.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;