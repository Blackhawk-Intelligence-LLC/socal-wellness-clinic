import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FAQ = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const faqs = [
    {
      question: "How does medical weight loss differ from regular dieting?",
      answer: "Medical weight loss is supervised by healthcare professionals and may include FDA-approved medications, personalized nutrition plans, and regular monitoring. Unlike fad diets, our approach focuses on sustainable, long-term results tailored to your body's specific needs and health conditions."
    },
    {
      question: "Is the treatment covered by insurance?",
      answer: "Coverage varies by insurance plan. We offer complimentary insurance verification and work with many major providers. We also provide flexible payment plans and financing options to make our services accessible."
    },
    {
      question: "How quickly will I see results?",
      answer: "Results vary by individual and treatment type. Many patients see initial results within 2-4 weeks. Weight loss patients typically lose 1-3 pounds per week, while IV therapy benefits can be felt immediately. We'll set realistic expectations during your consultation."
    },
    {
      question: "Are the treatments safe?",
      answer: "Absolutely. All our treatments are FDA-approved and administered by licensed medical professionals. We conduct thorough health assessments before any treatment and continuously monitor your progress to ensure safety and effectiveness."
    },
    {
      question: "Do I need a referral to make an appointment?",
      answer: "No referral is needed! You can book a consultation directly with us. We'll perform a comprehensive evaluation during your first visit to determine the best treatment plan for your goals."
    },
    {
      question: "What should I expect during my first visit?",
      answer: "Your first visit includes a comprehensive health assessment, body composition analysis, discussion of your goals, and a personalized treatment plan. The consultation typically lasts 45-60 minutes. We'll answer all your questions and ensure you're comfortable before starting any treatment."
    },
    {
      question: "Can I combine multiple treatments?",
      answer: "Yes! Many of our patients benefit from combining treatments. For example, pairing weight loss with hormone optimization or adding IV therapy to your wellness routine. We'll create a comprehensive plan that addresses all your health goals."
    },
    {
      question: "What are your hours and how do I book an appointment?",
      answer: "We're open Monday through Friday from 8:00 AM to 6:00 PM. You can book online through our website, call us at 619-476-0060, or visit our clinic in Chula Vista. Same-day appointments are often available."
    }
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#001E40] to-[#012650] bg-clip-text text-transparent">Frequently Asked Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We've got answers. Learn more about our services and what to expect.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border-0 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 text-left">
                  <span className="text-lg font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;