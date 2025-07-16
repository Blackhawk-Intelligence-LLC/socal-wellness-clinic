import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Scale, 
  Droplets, 
  Sparkles, 
  Heart, 
  Activity, 
  Waves, 
  HeartHandshake, 
  Zap,
  ArrowRight 
} from 'lucide-react';

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      title: "Medical Weight Loss",
      description: "Personalized weight loss programs with FDA-approved medications and expert medical supervision for sustainable results.",
      icon: Scale,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      benefits: ["Custom meal plans", "Weekly check-ins", "FDA-approved medications"]
    },
    {
      title: "IV Therapy",
      description: "Revitalize your body with custom IV nutrient infusions designed to boost energy, immunity, and overall wellness.",
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      benefits: ["Instant hydration", "Vitamin boost", "Energy enhancement"]
    },
    {
      title: "Anti-Aging",
      description: "Turn back time with advanced treatments that rejuvenate your skin and restore youthful vitality from within.",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      benefits: ["Collagen boost", "Skin rejuvenation", "Cellular repair"]
    },
    {
      title: "PRP Hair Restoration",
      description: "Natural hair regrowth using your own platelet-rich plasma to stimulate follicles and restore thickness.",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      benefits: ["Natural treatment", "No downtime", "Long-lasting results"]
    },
    {
      title: "Hormone Replacement",
      description: "Optimize your hormones for better energy, mood, and vitality with bioidentical hormone therapy.",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      benefits: ["Increased energy", "Better sleep", "Improved mood"]
    },
    {
      title: "Cellulite Z Wave",
      description: "Revolutionary non-invasive treatment that smooths cellulite and improves skin texture.",
      icon: Waves,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      benefits: ["Non-invasive", "No recovery time", "Visible results"]
    },
    {
      title: "Erectile Dysfunction",
      description: "Discreet, effective treatments to restore confidence and improve intimate wellness.",
      icon: HeartHandshake,
      color: "text-red-600",
      bgColor: "bg-red-50",
      benefits: ["Confidential care", "Proven treatments", "Expert support"]
    },
    {
      title: "NAD+ Therapy",
      description: "Cutting-edge cellular regeneration therapy to boost energy, mental clarity, and longevity.",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      benefits: ["Cellular repair", "Mental clarity", "Anti-aging benefits"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive wellness solutions tailored to your unique health goals
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className={`${service.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${service.color}`} />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="group">
            View All Services
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;