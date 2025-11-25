import { useEffect, useRef } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        ref={heroRef}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, hsl(var(--chart-4) / 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 30%, hsl(var(--chart-2) / 0.06) 0%, transparent 50%),
            linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.3) 50%, hsl(var(--background)) 100%)
          `,
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-4/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="relative inline-block">
          <h1 className="font-display text-[clamp(4rem,15vw,12rem)] leading-none tracking-tighter text-foreground select-none"
              style={{
                textShadow: `
                  3px 3px 0px hsl(var(--primary) / 0.2),
                  6px 6px 0px hsl(var(--primary) / 0.15),
                  9px 9px 0px hsl(var(--primary) / 0.1)
                `,
              }}
              data-testid="text-hero-title"
          >
            <span className="inline-block relative">
              P
              <span 
                className="absolute -top-8 -right-6 text-[0.3em] rotate-12 font-sans font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-3 py-1 rounded-md shadow-lg"
              >
                NEXT
              </span>
            </span>
            <span className="inline-block" style={{ transform: 'translateY(0.15em)' }}>A</span>
            <span className="inline-block" style={{ transform: 'translateY(0.05em)' }}>T</span>
            <span className="inline-block" style={{ transform: 'translateY(0.2em)' }}>H</span>
          </h1>
        </div>
        
        <p className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Building smarter communities through innovation
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 bg-background/50 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        </div>
      </div>
    </section>
  );
}
