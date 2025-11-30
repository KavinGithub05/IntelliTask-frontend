/**
 * Environment Configuration
 * This file provides centralized configuration management
 * for the application, including API URLs for different environments.
 *
 * CURRENTLY HARDCODED FOR PRODUCTION DEBUGGING
 * TODO: Restore dynamic environment detection
 */

// Define the full URLs for both environments
const DEVELOPMENT_API_URL = 'http://localhost:3000/api';

// FORCED PRODUCTION URL TO FIX MALFORMED URL ISSUE
export const environment = {
  production: false,
  apiUrl: 'https://intellitask-backend.onrender.com/api', // Backend only - no frontend domain
  // Force refresh cache
  version: '1.0.3',
};
