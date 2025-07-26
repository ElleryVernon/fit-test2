import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ClientLogos from '@/components/home/ClientLogos';
import VisualDemo from '@/components/home/VisualDemo';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      <Navbar />
      <Hero />
      <Features />
      <ClientLogos />
      <VisualDemo />
      <CTA />
      <Footer />
    </main>
  );
}
