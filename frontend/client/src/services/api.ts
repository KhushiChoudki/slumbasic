import API_CONFIG from '@/config/api';

export interface UploadVerifyResponse {
  similarity: number;
  cid: string;
  metadataCID: string;
  location: string;
  message?: string;
  error?: string;
}

/**
 * Upload an image with description and location to the Flask backend
 * The backend will verify the image using CLIP AI and upload to IPFS via Pinata
 */
export const uploadAndVerifyImage = async (
  imageFile: File,
  description: string,
  location: string
): Promise<UploadVerifyResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('description', description);
  formData.append('location', location);

  const response = await fetch(
    `${API_CONFIG.FLASK_BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_AND_VERIFY}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get the IPFS gateway URL for a given CID
 */
export const getIPFSUrl = (cid: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};
