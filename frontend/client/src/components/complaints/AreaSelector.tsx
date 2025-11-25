import { useEffect, useState } from 'react';
import { getAreas } from '@/services/complaintsApi';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AreaSelectorProps {
  selectedArea: string | null;
  onSelectArea: (area: string) => void;
}

export default function AreaSelector({ selectedArea, onSelectArea }: AreaSelectorProps) {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAreas() {
      try {
        setLoading(true);
        setError(null);
        const fetchedAreas = await getAreas(controller.signal);
        setAreas(fetchedAreas);
        
        // Auto-select first area if none selected
        if (!selectedArea && fetchedAreas.length > 0) {
          onSelectArea(fetchedAreas[0]);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to load areas');
          // Fallback to Dharavi on error
          setAreas(['Dharavi']);
          if (!selectedArea) {
            onSelectArea('Dharavi');
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAreas();

    return () => {
      controller.abort();
    };
  }, []); // Only run once on mount

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading areas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 dark:text-red-400">
        {error} (Using default area)
      </div>
    );
  }

  return (
    <div 
      className="flex flex-wrap gap-2 p-4"
      role="tablist"
      aria-label="Select area for complaints"
    >
      {areas.map((area) => (
        <Button
          key={area}
          variant={selectedArea === area ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectArea(area)}
          role="tab"
          aria-selected={selectedArea === area}
          aria-controls={`complaints-panel-${area}`}
          className="transition-all"
        >
          {area}
        </Button>
      ))}
    </div>
  );
}
