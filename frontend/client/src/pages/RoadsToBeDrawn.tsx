import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";

interface Area {
  id: string;
  name: string;
  description: string;
  status: string;
  featureCount?: number;
}

export default function RoadsToBeDrawn() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/areas');
      if (!response.ok) {
        throw new Error('Failed to fetch areas');
      }
      const data = await response.json();
      setAreas(data);
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Roads to be Drawn</h1>
        <p className="text-muted-foreground text-lg">
          Select an area to view and manage road network visualizations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <Card key={area.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>{area.name}</CardTitle>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {area.status}
                </span>
              </div>
              <CardDescription>{area.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {area.featureCount !== undefined && (
                <p className="text-sm text-muted-foreground mb-4">
                  {area.featureCount} features available
                </p>
              )}
              <Link href={`/roads-to-be-drawn/${area.id}`}>
                <Button className="w-full group">
                  View Map
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {areas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No areas available yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
