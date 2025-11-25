import Hero from "@/components/Hero";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import PrototypeSection from "@/components/PrototypeSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDoSection />
      <PrototypeSection />
      <AboutSection />
      <Footer />
      <HelpButton />
    </>
  );
}
