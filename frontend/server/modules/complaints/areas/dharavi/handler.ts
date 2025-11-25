import { type IAreaHandler, type AreaConfig, type ComplaintData } from '../../types';
import { promises as fs } from 'fs';
import path from 'path';

export class DharaviHandler implements IAreaHandler {
  private readonly areaConfig: AreaConfig = {
    id: 'dharavi',
    name: 'Dharavi',
    displayName: 'Dharavi, Mumbai',
    description: 'Road network and infrastructure complaints for Dharavi area',
    enabled: true,
    dataPath: 'server/data/points.json'
  };

  getAreaInfo(): AreaConfig {
    return this.areaConfig;
  }

  async getComplaintsData(): Promise<ComplaintData> {
    try {
      const dataPath = path.join(process.cwd(), this.areaConfig.dataPath!);
      const rawData = await fs.readFile(dataPath, 'utf-8');
      const geoJsonData = JSON.parse(rawData);

      // Add metadata
      const complaintData: ComplaintData = {
        ...geoJsonData,
        metadata: {
          totalFeatures: geoJsonData.features?.length || 0,
          area: this.areaConfig.name,
          lastUpdated: new Date()
        }
      };

      return complaintData;
    } catch (error) {
      console.error('Error loading Dharavi complaints data:', error);
      throw new Error('Failed to load complaints data for Dharavi');
    }
  }

  async getStatistics(): Promise<any> {
    try {
      const data = await this.getComplaintsData();
      const features = data.features || [];

      // Calculate statistics
      const roadFeatures = features.filter((f: any) => 
        f.properties?.highway || f.geometry?.type === 'LineString'
      );
      const pointFeatures = features.filter((f: any) => 
        f.geometry?.type === 'Point'
      );
      const buildingFeatures = features.filter((f: any) => 
        f.properties?.building
      );

      return {
        total: features.length,
        roads: roadFeatures.length,
        points: pointFeatures.length,
        buildings: buildingFeatures.length,
        area: this.areaConfig.name,
        byType: {
          LineString: features.filter((f: any) => f.geometry?.type === 'LineString').length,
          Point: features.filter((f: any) => f.geometry?.type === 'Point').length,
          Polygon: features.filter((f: any) => f.geometry?.type === 'Polygon').length,
        }
      };
    } catch (error) {
      console.error('Error calculating Dharavi statistics:', error);
      throw new Error('Failed to calculate statistics for Dharavi');
    }
  }
}
