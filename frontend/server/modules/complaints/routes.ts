import type { Express, Request, Response } from 'express';
import { areaRegistry } from './registry';

export function registerComplaintsRoutes(app: Express) {
  // Get list of all supported areas
  app.get('/api/complaints/areas', async (_req: Request, res: Response) => {
    try {
      const areas = areaRegistry.getAllAreas();
      res.json({
        success: true,
        areas: areas.map(area => ({
          id: area.id,
          name: area.name,
          displayName: area.displayName,
          description: area.description
        })),
        total: areas.length
      });
    } catch (error) {
      console.error('Error fetching areas:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch available areas'
      });
    }
  });

  // Get complaints data for a specific area
  app.get('/api/complaints/:areaId/data', async (req: Request, res: Response) => {
    try {
      const { areaId } = req.params;

      if (!areaRegistry.isAreaSupported(areaId)) {
        return res.status(404).json({
          success: false,
          error: `Area '${areaId}' is not supported`,
          availableAreas: areaRegistry.getAreaIds()
        });
      }

      const handler = areaRegistry.getHandler(areaId);
      if (!handler) {
        return res.status(404).json({
          success: false,
          error: 'Area handler not found'
        });
      }

      const data = await handler.getComplaintsData();
      res.json({
        success: true,
        area: areaId,
        data
      });
    } catch (error) {
      console.error(`Error fetching complaints data for area:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch complaints data'
      });
    }
  });

  // Get statistics for a specific area
  app.get('/api/complaints/:areaId/statistics', async (req: Request, res: Response) => {
    try {
      const { areaId } = req.params;

      if (!areaRegistry.isAreaSupported(areaId)) {
        return res.status(404).json({
          success: false,
          error: `Area '${areaId}' is not supported`
        });
      }

      const handler = areaRegistry.getHandler(areaId);
      if (!handler || !handler.getStatistics) {
        return res.status(404).json({
          success: false,
          error: 'Statistics not available for this area'
        });
      }

      const stats = await handler.getStatistics();
      res.json({
        success: true,
        area: areaId,
        statistics: stats
      });
    } catch (error) {
      console.error(`Error fetching statistics for area:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch area statistics'
      });
    }
  });

  // Get area information
  app.get('/api/complaints/:areaId/info', async (req: Request, res: Response) => {
    try {
      const { areaId } = req.params;

      if (!areaRegistry.isAreaSupported(areaId)) {
        return res.status(404).json({
          success: false,
          error: `Area '${areaId}' is not supported`
        });
      }

      const handler = areaRegistry.getHandler(areaId);
      if (!handler) {
        return res.status(404).json({
          success: false,
          error: 'Area handler not found'
        });
      }

      const info = handler.getAreaInfo();
      res.json({
        success: true,
        info
      });
    } catch (error) {
      console.error(`Error fetching area info:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch area information'
      });
    }
  });
}
