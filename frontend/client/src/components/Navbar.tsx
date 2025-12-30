import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToSection = (sectionId: string) => {
    if (location === "/") {
      scrollToSection(sectionId);
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigateToSection("hero")}
              className="text-xl font-display font-bold tracking-tight hover-elevate active-elevate-2 px-3 py-1 rounded-md flex items-center gap-2"
              data-testid="link-home"
            >
              <span className="text-2xl">🏘️</span>
              <span>PATH <span className="text-primary">NEXT</span></span>
            </button>
            
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToSection("hero")}
                data-testid="link-home-nav"
              >
                Home
              </Button>
              <Link href="/projects">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="link-projects"
                >
                  Prototype
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToSection("about")}
                data-testid="link-about"
              >
                About
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToSection("contact")}
                data-testid="link-contact"
              >
                Contact
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="mobile-menu">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateToSection("hero")}
              data-testid="link-home-mobile"
            >
              Home
            </Button>
            <Link href="/projects">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
                data-testid="link-projects-mobile"
              >
                Prototype
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateToSection("about")}
              data-testid="link-about-mobile"
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateToSection("contact")}
              data-testid="link-contact-mobile"
            >
              Contact
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
