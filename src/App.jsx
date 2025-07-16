import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isMissingConfig = !supabaseUrl || !supabaseKey;

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {isMissingConfig && (
          <div className="bg-red-600 text-white px-4 py-3 text-center font-medium">
            ⚠️ Configuration Error: Missing Supabase credentials. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel environment variables.
          </div>
        )}
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;