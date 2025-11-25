import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { MapContainer, TileLayer, GeoJSON, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Info } from 'lucide-react';
import AreaAnalytics from '@/components/AreaAnalytics';

interface GeoJSONFeature {
  type: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

interface AreaData {
  id: string;
  name: string;
  description: string;
  geojson: GeoJSONData;
  center: [number, number];
  zoom: number;
  connections?: number[][];
}

export default function AreaDetail() {
  const [, params] = useRoute("/roads-to-be-drawn/:areaId");
  const areaId = params?.areaId;

  const [areaData, setAreaData] = useState<AreaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (areaId) {
      fetchAreaData(areaId);
    }
  }, [areaId]);

  const fetchAreaData = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/areas/${id}/map`);
      if (!response.ok) {
        throw new Error('Failed to fetch area data');
      }
      const data = await response.json();
      setAreaData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !areaData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-96">
            <p className="text-red-500 mb-4">Error: {error || 'Area not found'}</p>
            <Link href="/roads-to-be-drawn">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Areas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract point coordinates for connections
  const pointFeatures = areaData.geojson.features.filter(
    (f) => f.geometry.type === 'Point'
  );
  const pointCoords = pointFeatures.map((f) => f.geometry.coordinates as number[]);

  // Style function for GeoJSON features
  const styleFeature = (feature?: any) => {
    if (!feature) return {};
    
    if (
      feature.geometry.type === 'LineString' ||
      feature.geometry.type === 'MultiLineString'
    ) {
      return {
        color: 'black',
        weight: 3,
      };
    }
    return {};
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link href="/roads-to-be-drawn">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Areas
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{areaData.name}</CardTitle>
              <p className="text-muted-foreground mt-2">{areaData.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>{areaData.geojson.features.length} features</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <MapContainer
              center={areaData.center}
              zoom={areaData.zoom}
              className="h-full w-full"
              style={{ height: '600px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <GeoJSON
                data={areaData.geojson as any}
                style={styleFeature}
                pointToLayer={(feature, latlng) => {
                  return new (window as any).L.CircleMarker(latlng, {
                    radius: 5,
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.7,
                  });
                }}
                onEachFeature={(feature, layer) => {
                  if (feature.properties.name) {
                    layer.bindPopup(`
                      <div>
                        <strong>${feature.properties.name}</strong>
                        ${feature.properties.highway ? `<p>Type: ${feature.properties.highway}</p>` : ''}
                      </div>
                    `);
                  }
                }}
              />

              {/* Render custom connections between points */}
              {areaData.connections && areaData.connections.map(([i, j], index) => {
                if (i < pointCoords.length && j < pointCoords.length) {
                  const positions: [number, number][] = [
                    [pointCoords[i][1], pointCoords[i][0]], // [lat, lng]
                    [pointCoords[j][1], pointCoords[j][0]],
                  ];
                  return (
                    <Polyline
                      key={`connection-${index}`}
                      positions={positions}
                      pathOptions={{
                        color: 'red',
                        weight: 3,
                        dashArray: '5, 5',
                      }}
                    />
                  );
                }
                return null;
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <AreaAnalytics geojson={areaData.geojson} />
    </div>
  );
}
