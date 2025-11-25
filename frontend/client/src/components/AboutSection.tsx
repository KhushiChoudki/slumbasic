import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import networkImage from "@assets/generated_images/Network_diagram_visualization_59a50a6e.png";

export default function AboutSection() {
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
      id="about"
      ref={sectionRef}
      className={`py-24 px-4 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <h2 
          className="text-5xl md:text-7xl font-display font-bold mb-16 tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          data-testid="text-about-title"
        >
          about us»
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground" data-testid="text-about-description-1">
              We help design better communities using satellite images and smart technology, providing clear and practical road layouts.
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground" data-testid="text-about-description-2">
              Residents can easily report issues like potholes or road conditions. After being verified and used to update road plans, creating safer routes that are connected, and inclusive neighborhoods.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                variant="default"
                className="shadow-lg"
                onClick={() => {
                  window.location.href = '/projects';
                }}
                data-testid="button-see-projects"
              >
                see our projects →
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                data-testid="button-get-in-touch"
              >
                get in touch
              </Button>
            </div>
          </div>

          <Card className="p-8 relative group overflow-hidden">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-chart-4/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={networkImage}
              alt="Network diagram showing community connections"
              className="relative w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              data-testid="img-network-diagram"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
