// API Configuration
export const API_CONFIG = {
  // Flask backend URL - change this to match your backend server
  FLASK_BASE_URL: import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5001',
  
  // API Endpoints
  ENDPOINTS: {
    UPLOAD_AND_VERIFY: '/upload_and_verify',
  }
};

export default API_CONFIG;
