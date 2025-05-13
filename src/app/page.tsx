import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Challenge from '@/components/home/Challenge';
import Solution from '@/components/home/Solution';
import Features from '@/components/home/Features';
import UseCases from '@/components/home/UseCases';
import Vision from '@/components/home/Vision';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      <Navbar />
      <Hero />
      <Challenge />
      <Solution />
      <Features />
      <UseCases />
      <Vision />
      <CTA />
      <Footer />
    </main>
  );
}
