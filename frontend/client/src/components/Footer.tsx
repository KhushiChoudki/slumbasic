import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-display font-bold mb-4" data-testid="text-footer-logo">
              PATH
            </h3>
            <p className="text-background/80" data-testid="text-footer-tagline">
              Building better communities through technology
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-background" data-testid="text-contact-title">
              Contact
            </h4>
            <div className="space-y-2 text-background/90">
              <p data-testid="text-phone">
                <span className="font-medium">Phone:</span><br />
                +1 (555) 123-4567
              </p>
              <p data-testid="text-email">
                <span className="font-medium">Email:</span><br />
                hello@pathproject.com
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-background" data-testid="text-social-title">
              Social
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover-elevate active-elevate-2 p-2 rounded-md"
                aria-label="Facebook"
                data-testid="link-facebook"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Facebook clicked');
                }}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover-elevate active-elevate-2 p-2 rounded-md"
                aria-label="Twitter"
                data-testid="link-twitter"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Twitter clicked');
                }}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover-elevate active-elevate-2 p-2 rounded-md"
                aria-label="Instagram"
                data-testid="link-instagram"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Instagram clicked');
                }}
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 text-center text-background/70 text-sm">
          <p data-testid="text-copyright">
            © 2024 PATH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
