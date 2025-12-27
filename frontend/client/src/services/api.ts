import API_CONFIG from "@/config/api";

export interface UploadVerifyResponse {
  similarity: number;
  cid: string;
  metadataCID: string;
  location: string;
  message?: string; // e.g. "Image does not look like a damaged road"
  error?: string;
  clip_info?: {
    best_valid_prompt?: string;
    best_valid_score?: number;
    best_invalid_prompt?: string;
    best_invalid_score?: number;
  };
}

/**
 * Upload an image with description and location to the Flask backend.
 * The backend will verify the image using CLIP AI and upload to IPFS via Pinata.
 */
export const uploadAndVerifyImage = async (
  imageFile: File,
  description: string,
  location: string
): Promise<UploadVerifyResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("description", description);
  formData.append("location", location);

  const response = await fetch(
    `${API_CONFIG.FLASK_BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_AND_VERIFY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data: any = {};
  try {
    // backend always returns JSON (even on error)
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      data.message || // our Flask "message" field
      data.error ||   // our Flask "error" field
      `Upload failed: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return data as UploadVerifyResponse;
};

/**
 * Get the IPFS gateway URL for a given CID
 */
export const getIPFSUrl = (cid: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};
