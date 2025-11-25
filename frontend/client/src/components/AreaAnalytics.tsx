import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';

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

interface AreaAnalyticsProps {
  geojson: GeoJSONData;
}

const COLORS = [
  '#9333ea', // primary purple
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#a855f7', // purple
  '#c026d3', // fuchsia
  '#9333ea80', // light purple
  '#ec489980', // light pink
];

export default function AreaAnalytics({ geojson }: AreaAnalyticsProps) {
  const analytics = useMemo(() => {
    const features = geojson.features;
    
    // Count highway types
    const highwayTypes: Record<string, number> = {};
    const lengthsByType: Record<string, number[]> = {};
    const sinuosityData: number[] = [];
    let totalLength = 0;
    let namedRoads = 0;
    
    features.forEach((feature) => {
      const props = feature.properties;
      const highway = props.highway;
      
      if (highway) {
        highwayTypes[highway] = (highwayTypes[highway] || 0) + 1;
        
        if (props.length) {
          if (!lengthsByType[highway]) lengthsByType[highway] = [];
          lengthsByType[highway].push(props.length);
          totalLength += props.length;
        }
        
        if (props.sinuosity && props.sinuosity > 1) {
          sinuosityData.push(props.sinuosity);
        }
        
        if (props.name) {
          namedRoads++;
        }
      }
    });

    // Prepare pie chart data for highway types
    const highwayPieData = Object.entries(highwayTypes)
      .map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value,
        percentage: ((value / features.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);

    // Prepare bar chart data for average lengths
    const lengthBarData = Object.entries(lengthsByType)
      .map(([name, lengths]) => ({
        name: name.replace(/_/g, ' ').substring(0, 15),
        avgLength: (lengths.reduce((a, b) => a + b, 0) / lengths.length) * 1000, // convert to meters
        count: lengths.length
      }))
      .sort((a, b) => b.avgLength - a.avgLength)
      .slice(0, 8);

    // Calculate sinuosity stats
    const avgSinuosity = sinuosityData.length > 0
      ? sinuosityData.reduce((a, b) => a + b, 0) / sinuosityData.length
      : 0;

    // Sinuosity distribution (1.0-1.1, 1.1-1.2, etc.)
    const sinuosityRanges = [
      { range: '1.0-1.1', min: 1.0, max: 1.1 },
      { range: '1.1-1.2', min: 1.1, max: 1.2 },
      { range: '1.2-1.5', min: 1.2, max: 1.5 },
      { range: '1.5+', min: 1.5, max: 999 },
    ];

    const sinuosityDistribution = sinuosityRanges.map(({ range, min, max }) => ({
      range,
      count: sinuosityData.filter(s => s >= min && s < max).length
    }));

    return {
      highwayPieData,
      lengthBarData,
      sinuosityDistribution,
      stats: {
        totalFeatures: features.length,
        totalRoadTypes: Object.keys(highwayTypes).length,
        totalLength: (totalLength * 1000).toFixed(2), // meters
        namedRoads,
        avgSinuosity: avgSinuosity.toFixed(3),
        pointFeatures: features.filter(f => f.geometry.type === 'Point').length,
        lineFeatures: features.filter(f => f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString').length,
      }
    };
  }, [geojson]);

  return (
    <div className="space-y-6 mt-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.totalFeatures}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Road Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.totalRoadTypes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Named Roads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.namedRoads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Sinuosity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.avgSinuosity}</div>
            <p className="text-xs text-muted-foreground mt-1">1.0 = straight</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highway Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Road Type Distribution</CardTitle>
            <CardDescription>
              Breakdown of {analytics.stats.totalFeatures} features by highway type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.highwayPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.highwayPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value} (${props.payload.percentage}%)`,
                      name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {analytics.highwayPieData.slice(0, 5).map((item, index) => (
                <Badge key={index} variant="outline" style={{ borderColor: COLORS[index] }}>
                  {item.name}: {item.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Length by Road Type */}
        <Card>
          <CardHeader>
            <CardTitle>Average Road Length by Type</CardTitle>
            <CardDescription>
              Mean length in meters for top road categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.lengthBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Meters', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}m`, 'Avg Length']}
                    labelFormatter={(label) => `Road Type: ${label}`}
                  />
                  <Bar dataKey="avgLength" fill="#9333ea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sinuosity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Road Sinuosity Distribution</CardTitle>
            <CardDescription>
              How winding/curved the roads are (1.0 = perfectly straight)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.sinuosityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="range"
                    label={{ value: 'Sinuosity Range', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Sinuosity measures how much a road curves relative to the straight-line distance.</p>
              <p className="mt-1">Higher values indicate more winding roads.</p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Geometry Type Distribution</CardTitle>
            <CardDescription>
              Distribution by geometric feature type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Points', value: analytics.stats.pointFeatures },
                      { name: 'Lines', value: analytics.stats.lineFeatures },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#9333ea" />
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analytics.stats.pointFeatures}</div>
                <div className="text-sm text-muted-foreground">Point Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#ec4899' }}>{analytics.stats.lineFeatures}</div>
                <div className="text-sm text-muted-foreground">Line Features</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              <div>
                <p className="font-medium">Total Network Length</p>
                <p className="text-sm text-muted-foreground">{analytics.stats.totalLength} meters of mapped roads</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-pink-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Road Naming Coverage</p>
                <p className="text-sm text-muted-foreground">
                  {((analytics.stats.namedRoads / analytics.stats.totalFeatures) * 100).toFixed(1)}% of roads have official names
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-violet-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Most Common Type</p>
                <p className="text-sm text-muted-foreground">
                  {analytics.highwayPieData[0]?.name || 'N/A'} ({analytics.highwayPieData[0]?.value || 0} features)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Urban Planning Data</p>
                <p className="text-sm text-muted-foreground">
                  All data sourced from OpenStreetMap contributions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
