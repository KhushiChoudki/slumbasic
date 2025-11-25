// Complaints Module - Main Entry Point
// This module handles area-based complaints data and provides a scalable architecture
// for adding new areas in the future.

export { registerComplaintsRoutes } from './routes';
export { areaRegistry } from './registry';
export type { IAreaHandler, AreaConfig, ComplaintData, ComplaintPoint } from './types';

// Quick Guide for Adding New Areas:
// 1. Create a new folder in server/modules/complaints/areas/<area-name>
// 2. Create a handler.ts file implementing IAreaHandler interface
// 3. Register the handler in registry.ts
// 4. Add any area-specific data to server/data/<area-name>/
// 5. The area will automatically be available via the API

/**
 * Available API Endpoints:
 * 
 * GET /api/complaints/areas
 * - Returns list of all supported areas
 * 
 * GET /api/complaints/:areaId/data
 * - Returns complaints/road network data for specific area
 * - Example: /api/complaints/dharavi/data
 * 
 * GET /api/complaints/:areaId/statistics
 * - Returns statistics for specific area
 * - Example: /api/complaints/dharavi/statistics
 * 
 * GET /api/complaints/:areaId/info
 * - Returns configuration info for specific area
 * - Example: /api/complaints/dharavi/info
 */
