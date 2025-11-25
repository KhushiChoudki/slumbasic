import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PrototypeCardProps {
  image: string;
  title: string;
  testId?: string;
}

export default function PrototypeCard({ image, title, testId }: PrototypeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ${
        isHovered ? "-translate-y-3 shadow-2xl scale-[1.02]" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={testId}
    >
      <div className="aspect-[4/5] relative">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-4/20 transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`} />

        <div className="absolute top-4 right-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-md bg-gradient-to-t from-black/60 to-transparent">
          <div className={`transition-all duration-500 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"}`}>
            <h3 className="text-white font-bold text-2xl mb-4 tracking-tight" data-testid={`text-title-${testId}`}>
              {title}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/95 hover:bg-white text-foreground border-0 font-semibold shadow-lg"
              onClick={() => console.log(`${title} - Find out more clicked`)}
              data-testid={`button-find-out-${testId}`}
            >
              find out more →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
