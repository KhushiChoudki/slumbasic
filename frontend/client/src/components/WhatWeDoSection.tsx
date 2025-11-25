import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import urbanImage from "@assets/generated_images/Urban_settlement_aerial_view_7ee3fbe0.png";

export default function WhatWeDoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 px-4 transition-all duration-1000 relative overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-chart-4/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto relative">
        <h2 
          className="text-5xl md:text-7xl font-display font-bold mb-16 tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          data-testid="text-what-we-do-title"
        >
          What are we doing?
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-chart-4/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={urbanImage}
              alt="Aerial view of urban community"
              className="relative w-full h-auto rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-primary/20"
              loading="lazy"
              data-testid="img-urban-aerial"
            />
          </div>

          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground" data-testid="text-description-1">
              We are building a platform that helps design better communities using satellite images and smart technology. Residents in areas like Dharavi, Mumbai and Case Town, or upload their own images to see suggested road layouts. Residents can explore these suggestions to help create road plans based on this new information, making the process smoother for their community drivers, and contractors to use directly.
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground" data-testid="text-description-2">
              By simply clicking and uploading a photo, Those reports are verified, recorded securely, and accessible to residents and authorities. This streamlines workflows—it's a tool for organizing and verifying neighborhoods.
            </p>

            <Button
              variant="default"
              size="lg"
              className="mt-4 shadow-lg"
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              data-testid="button-learn-more"
            >
              Learn more →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
