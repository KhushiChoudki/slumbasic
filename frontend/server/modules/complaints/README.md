# Complaints Module Architecture

## Overview
A scalable, area-based complaints management system for handling road network and infrastructure data across multiple geographic areas.

## Current Areas
- **Dharavi** (Mumbai) - Road network with 489 GeoJSON features

## Module Structure

```
server/modules/complaints/
├── index.ts              # Main entry point and exports
├── types.ts              # TypeScript interfaces and types
├── registry.ts           # Area handler registry (singleton)
├── routes.ts             # Express route handlers
└── areas/                # Area-specific handlers
    └── dharavi/
        └── handler.ts    # Dharavi area implementation
```

## Architecture Principles

### 1. Interface-Based Design
All area handlers implement the `IAreaHandler` interface:
```typescript
interface IAreaHandler {
  getAreaInfo(): AreaConfig;
  getComplaintsData(): Promise<ComplaintData>;
  getStatistics?(): Promise<any>;
}
```

### 2. Registry Pattern
The `AreaRegistry` class manages all area handlers:
- Centralized registration
- Easy lookup by area ID
- Validation of supported areas
- Singleton pattern for consistency

### 3. Modular Areas
Each area is self-contained with:
- Own handler class
- Own data source
- Own business logic
- Independent of other areas

## API Endpoints

### GET /api/complaints/areas
Returns list of all supported areas.

**Response:**
```json
{
  "success": true,
  "areas": [
    {
      "id": "dharavi",
      "name": "Dharavi",
      "displayName": "Dharavi, Mumbai",
      "description": "Road network and infrastructure complaints for Dharavi area"
    }
  ],
  "total": 1
}
```

### GET /api/complaints/:areaId/data
Returns GeoJSON complaints data for specific area.

**Example:** `/api/complaints/dharavi/data`

**Response:**
```json
{
  "success": true,
  "area": "dharavi",
  "data": {
    "type": "FeatureCollection",
    "features": [...],
    "metadata": {
      "totalFeatures": 489,
      "area": "Dharavi",
      "lastUpdated": "2025-11-25T..."
    }
  }
}
```

### GET /api/complaints/:areaId/statistics
Returns statistical summary for area.

**Example:** `/api/complaints/dharavi/statistics`

**Response:**
```json
{
  "success": true,
  "area": "dharavi",
  "statistics": {
    "total": 489,
    "roads": 57,
    "points": 122,
    "buildings": 310,
    "area": "Dharavi",
    "byType": {
      "LineString": 57,
      "Point": 122,
      "Polygon": 310
    }
  }
}
```

### GET /api/complaints/:areaId/info
Returns configuration information for area.

**Example:** `/api/complaints/dharavi/info`

**Response:**
```json
{
  "success": true,
  "info": {
    "id": "dharavi",
    "name": "Dharavi",
    "displayName": "Dharavi, Mumbai",
    "description": "Road network and infrastructure complaints for Dharavi area",
    "enabled": true,
    "dataPath": "server/data/points.json"
  }
}
```

## Adding New Areas

### Step 1: Create Area Handler
Create `server/modules/complaints/areas/<area-name>/handler.ts`:

```typescript
import { type IAreaHandler, type AreaConfig, type ComplaintData } from '../../types';

export class NewAreaHandler implements IAreaHandler {
  private readonly areaConfig: AreaConfig = {
    id: 'new-area',
    name: 'New Area',
    displayName: 'New Area, City',
    description: 'Description of the area',
    enabled: true,
    dataPath: 'server/data/new-area-data.json'
  };

  getAreaInfo(): AreaConfig {
    return this.areaConfig;
  }

  async getComplaintsData(): Promise<ComplaintData> {
    // Implement data loading logic
  }

  async getStatistics(): Promise<any> {
    // Implement statistics calculation (optional)
  }
}
```

### Step 2: Register Handler
Update `server/modules/complaints/registry.ts`:

```typescript
private registerAreas() {
  // Existing areas
  const dharaviHandler = new DharaviHandler();
  this.handlers.set('dharavi', dharaviHandler);

  // Add new area
  const newAreaHandler = new NewAreaHandler();
  this.handlers.set('new-area', newAreaHandler);
}
```

### Step 3: Add Data File
Place data file at the path specified in `areaConfig.dataPath`.

### Step 4: Test
The new area will automatically be available via:
- `/api/complaints/areas` (will include new area)
- `/api/complaints/new-area/data`
- `/api/complaints/new-area/statistics`
- `/api/complaints/new-area/info`

## Data Format

### GeoJSON Structure
```json
{
  "type": "FeatureCollection",
  "name": "area-name",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Feature Name",
        "highway": "residential",
        "building": "yes"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      }
    }
  ]
}
```

## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "error": "Error message",
  "availableAreas": ["dharavi"]  // When area not found
}
```

## Benefits of This Architecture

1. **Scalability**: Add new areas without modifying existing code
2. **Maintainability**: Each area is isolated and testable
3. **Type Safety**: Full TypeScript support with interfaces
4. **Flexibility**: Each area can have custom logic and data sources
5. **Consistency**: Standardized API across all areas
6. **Error Handling**: Robust validation and error messages

## Future Enhancements

Possible extensions without architecture changes:
- Add authentication/authorization per area
- Implement caching for data endpoints
- Add filtering and search capabilities
- Support real-time updates via WebSockets
- Add data export functionality
- Implement area-specific analytics

## Integration with Frontend

Frontend can:
1. Fetch available areas: `GET /api/complaints/areas`
2. Let user select an area
3. Load area data: `GET /api/complaints/{selectedArea}/data`
4. Display on map using the existing MapVisualization component

Example frontend flow:
```typescript
// 1. Fetch areas
const { areas } = await fetch('/api/complaints/areas').then(r => r.json());

// 2. User selects area (e.g., "dharavi")
const selectedArea = userSelection;

// 3. Fetch area data
const { data } = await fetch(`/api/complaints/${selectedArea}/data`)
  .then(r => r.json());

// 4. Display on map
<MapVisualization data={data} area={selectedArea} />
```

## Testing

Test each endpoint:
```bash
# Get areas
curl http://localhost:5000/api/complaints/areas

# Get Dharavi data
curl http://localhost:5000/api/complaints/dharavi/data

# Get Dharavi statistics
curl http://localhost:5000/api/complaints/dharavi/statistics

# Get Dharavi info
curl http://localhost:5000/api/complaints/dharavi/info

# Test invalid area (should return 404)
curl http://localhost:5000/api/complaints/invalid/data
```
