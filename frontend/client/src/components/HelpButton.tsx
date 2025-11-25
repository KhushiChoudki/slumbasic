import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpButton() {
  return (
    <Button
      size="icon"
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-40"
      onClick={() => console.log('Help button clicked')}
      data-testid="button-help"
      aria-label="Help"
    >
      <HelpCircle className="h-6 w-6" />
    </Button>
  );
}
