import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import AreaSelector from './AreaSelector';
import AreaMetadataChart from './AreaMetadataChart';
import ComplaintsList from './ComplaintsList';
import { getAreaMetadata, type AreaMetadata } from '@/services/complaintsApi';

/**
 * Main container component for the Complaints section
 * Composes AreaSelector, AreaMetadataChart, and ComplaintsList
 * 
 * Responsive layout:
 * - Desktop: 2-column grid (chart | complaints)
 * - Tablet/Mobile: Stacked layout (area selector -> chart -> complaints)
 */
export default function CheckComplaintsSection() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<AreaMetadata>({});
  const [metadataLoading, setMetadataLoading] = useState(false);

  // Fetch metadata when area changes
  useEffect(() => {
    if (!selectedArea) return;

    const controller = new AbortController();

    async function fetchMetadata() {
      try {
        setMetadataLoading(true);
        const data = await getAreaMetadata(selectedArea, controller.signal);
        setMetadata(data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to fetch metadata:', err);
          setMetadata({}); // Clear metadata on error
        }
      } finally {
        setMetadataLoading(false);
      }
    }

    fetchMetadata();

    return () => {
      controller.abort();
    };
  }, [selectedArea]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Check for Complaints</h2>
        <p className="text-muted-foreground">
          View reported complaints and infrastructure overview by area
        </p>
      </div>

      {/* Area Selector */}
      <Card>
        <AreaSelector
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
        />
      </Card>

      {/* Main Content Area - Only show when area is selected */}
      {selectedArea && (
        <div
          className="grid gap-6 lg:grid-cols-2"
          role="region"
          aria-label={`Complaints and metadata for ${selectedArea}`}
          id={`complaints-panel-${selectedArea}`}
        >
          {/* Left Column: Metadata Chart */}
          <div className="space-y-6">
            <AreaMetadataChart
              metadata={metadata}
              area={selectedArea}
              loading={metadataLoading}
            />
          </div>

          {/* Right Column: Complaints List */}
          <div className="space-y-6">
            <ComplaintsList area={selectedArea} />
          </div>
        </div>
      )}

      {/* Instructions when no area selected */}
      {!selectedArea && (
        <Card className="p-12">
          <div className="text-center space-y-2">
            <div className="text-4xl mb-4">👆</div>
            <p className="text-sm font-medium">Select an area above to view complaints</p>
            <p className="text-xs text-muted-foreground">
              Choose from the available areas to see reported complaints and infrastructure data
            </p>
          </div>
        </Card>
      )}
    </section>
  );
}
