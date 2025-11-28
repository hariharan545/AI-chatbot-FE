import axios from 'axios';

// Get API base URL from environment variable, fallback to empty string for relative URLs in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default apiClient;

// Export the API base URL for use in redirects
export const getApiBaseUrl = () => API_BASE_URL;

