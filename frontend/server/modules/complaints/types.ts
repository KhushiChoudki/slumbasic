// Area interface for complaints module
export interface AreaConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  enabled: boolean;
  dataPath?: string;
}

// Base interface for area handlers
export interface IAreaHandler {
  getAreaInfo(): AreaConfig;
  getComplaintsData(): Promise<any>;
  getStatistics?(): Promise<any>;
}

// Complaint data structure
export interface ComplaintPoint {
  type: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

export interface ComplaintData {
  type: string;
  features: ComplaintPoint[];
  metadata?: {
    totalFeatures: number;
    area: string;
    lastUpdated?: Date;
  };
}
