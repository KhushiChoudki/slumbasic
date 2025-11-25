/**
 * Complaints API Service
 * 
 * TODO: Update API_BASE to match your friend's backend URL
 * For local dev: http://localhost:5000/api
 * For production: set VITE_FRIENDS_BACKEND env variable
 */

// TODO: Change this to match your friend's backend base URL
const API_BASE = import.meta.env.VITE_FRIENDS_BACKEND || 'http://localhost:5000/api';

/**
 * TODO: If your backend uses different endpoint paths, update these:
 * - Areas endpoint might be: /areas, /regions, /locations
 * - Complaints endpoint might be: /complaints, /reports, /issues
 * - Metadata endpoint might be: /areas/{area}/metadata, /metadata?area={area}, /stats/{area}
 */

export interface Complaint {
  id: string | number;
  status: string;
  created_at: string; // TODO: might be createdAt, timestamp, date
  description: string;
  reporter: string; // TODO: might be reported_by, user, citizen_name
  image_url?: string; // TODO: might be attachment, image, photo_url
  // Add any other fields your backend returns
}

export interface ComplaintsResponse {
  complaints: Complaint[];
  total: number;
  page: number;
  limit: number;
  // TODO: Backend might return: { data, count, currentPage, perPage }
}

export interface AreaMetadata {
  urban_roads?: number;
  rural_roads?: number;
  highways?: number;
  drains?: number;
  streetlights?: number;
  [key: string]: number | undefined; // Dynamic keys for any metadata
}

export interface MetadataResponse {
  metadata: AreaMetadata;
  // TODO: Backend might wrap this differently: { data: {...}, area: "..." }
}

export interface AreasResponse {
  areas: string[];
  // TODO: Backend might return: { data: [...], regions: [...] }
}

/**
 * Fetch list of available areas
 * Fallback to ["Dharavi"] if endpoint doesn't exist or fails
 */
export async function getAreas(signal?: AbortSignal): Promise<string[]> {
  try {
    // TODO: Change '/areas' if your backend uses different path
    const response = await fetch(`${API_BASE}/areas`, { signal });
    
    if (!response.ok) {
      console.warn(`Areas endpoint returned ${response.status}, falling back to default`);
      return ['Dharavi'];
    }

    const data: AreasResponse = await response.json();
    
    // TODO: Adjust this if your backend returns areas in a different structure
    return data.areas && data.areas.length > 0 ? data.areas : ['Dharavi'];
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.warn('Failed to fetch areas, using default:', error);
    return ['Dharavi']; // Fallback
  }
}

/**
 * Fetch complaints for a specific area with pagination
 */
export async function getComplaints(
  area: string,
  page: number = 1,
  limit: number = 10,
  signal?: AbortSignal
): Promise<ComplaintsResponse> {
  try {
    // TODO: Change '/complaints' if your backend uses different path
    // TODO: Adjust query params if backend uses different names (e.g., offset instead of page)
    const url = new URL(`${API_BASE}/complaints`);
    url.searchParams.set('area', area);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString(), { signal });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch complaints: ${response.status} - ${errorText}`);
    }

    const data: ComplaintsResponse = await response.json();

    // TODO: If your backend returns data in different structure, map it here
    // Example: if backend returns { data: [...], count: X }
    // return { complaints: data.data, total: data.count, page, limit };

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch complaints. Please check if the backend is running.'
    );
  }
}

/**
 * Fetch metadata (infrastructure stats) for a specific area
 */
export async function getAreaMetadata(
  area: string,
  signal?: AbortSignal
): Promise<AreaMetadata> {
  try {
    // TODO: Change this endpoint path to match your backend
    // Option 1: /areas/{area}/metadata
    // Option 2: /metadata?area={area}
    // Option 3: /stats/{area}
    const response = await fetch(`${API_BASE}/areas/${area}/metadata`, { signal });

    if (!response.ok) {
      if (response.status === 404) {
        // Metadata not found - return empty object
        return {};
      }
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }

    const data: MetadataResponse = await response.json();

    // TODO: Adjust if backend wraps metadata differently
    return data.metadata || {};
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.warn('Failed to fetch area metadata:', error);
    // Return empty metadata instead of throwing - allows UI to show fallback
    return {};
  }
}

/**
 * TODO: If your backend requires authentication, add Authorization header:
 * 
 * const headers: HeadersInit = {
 *   'Content-Type': 'application/json',
 * };
 * 
 * const token = localStorage.getItem('authToken'); // or however you store it
 * if (token) {
 *   headers['Authorization'] = `Bearer ${token}`;
 * }
 * 
 * Then add { headers, signal } to fetch calls
 */
