// API configuration
// For production, use the Render backend URL
// For local development, use relative paths
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const API_ENDPOINTS = {
  generateToken: `${API_BASE_URL}/api/generate-token`,
  verifyToken: `${API_BASE_URL}/api/verify-token`,
  verifyPassword: `${API_BASE_URL}/api/verify-password`,
  saveImage: `${API_BASE_URL}/api/save-image`,
  adminLogin: `${API_BASE_URL}/api/admin/login`,
  adminEvents: `${API_BASE_URL}/api/admin/events`,
};
