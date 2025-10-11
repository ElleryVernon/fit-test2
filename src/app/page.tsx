import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/features/home/Hero";
import Features from "@/components/features/home/Features";
import ClientLogos from "@/components/features/home/ClientLogos";
import VisualDemo from "@/components/features/home/VisualDemo";
import CTA from "@/components/features/home/CTA";

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
