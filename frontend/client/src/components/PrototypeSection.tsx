import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PrototypeCard from "./PrototypeCard";
import aerialImage from "@assets/generated_images/Urban_settlement_aerial_view_7ee3fbe0.png";
import cityImage from "@assets/generated_images/City_blocks_satellite_view_a7aa93d2.png";
import streetImage from "@assets/generated_images/Community_street_view_fa39386d.png";

export default function PrototypeSection() {
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
      id="prototype"
      ref={sectionRef}
      className={`py-24 px-4 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
           }}
      />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-16">
          <h2 
            className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            data-testid="text-prototype-title"
          >
            prototype»
          </h2>
          <Button
            variant="default"
            size="lg"
            className="shadow-xl"
            onClick={() => {
              window.location.href = '/projects';
            }}
            data-testid="button-download-prototype"
          >
            View all prototype →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div 
            onClick={() => {
              window.location.href = '/uploads';
            }}
            className="cursor-pointer"
          >
            <PrototypeCard
              image={aerialImage}
              title="Submit Complaints"
              testId="card-check-uploads"
            />
          </div>
          <div 
            onClick={() => {
              window.location.href = '/roads-to-be-drawn';
            }}
            className="cursor-pointer"
          >
            <PrototypeCard
              image={streetImage}
              title="Roads to be Drawn"
              testId="card-roads-to-be-drawn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
