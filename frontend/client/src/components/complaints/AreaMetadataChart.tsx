import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AreaMetadata } from '@/services/complaintsApi';

/**
 * TODO: Install recharts if not already present:
 * npm install recharts
 * 
 * Alternative: If you prefer chart.js, replace this with a Chart.js implementation
 */

interface AreaMetadataChartProps {
  metadata: AreaMetadata;
  area: string;
  loading?: boolean;
}

// Color palette for chart segments
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Fallback colors if CSS variables not defined
const FALLBACK_COLORS = [
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
];

/**
 * Format metadata keys to human-readable labels
 */
function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AreaMetadataChart({ 
  metadata, 
  area,
  loading = false 
}: AreaMetadataChartProps) {
  // Transform metadata object into chart data
  const chartData = useMemo(() => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return [];
    }

    return Object.entries(metadata)
      .filter(([_, value]) => value !== undefined && value > 0) // Filter out zero/undefined values
      .map(([key, value]) => ({
        name: formatLabel(key),
        value: value as number,
        originalKey: key,
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [metadata]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Infrastructure Overview - {area}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-pulse">
                <div className="h-40 w-40 mx-auto bg-muted rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground">Loading metadata...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Infrastructure Overview - {area}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-2 max-w-md">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-sm font-medium">No metadata available for {area}</p>
              <p className="text-xs text-muted-foreground">
                Infrastructure data will appear here when available from the backend.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                <strong>Backend integration:</strong> Ensure the metadata endpoint is configured 
                and returns data for this area.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom label renderer with percentage
  const renderCustomLabel = (entry: any) => {
    const percentage = ((entry.value / total) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Infrastructure Overview - {area}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total infrastructure count: {total.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                ''
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => {
                const item = chartData[entry.payload?.index];
                return `${value}: ${item?.value.toLocaleString() || ''}`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
