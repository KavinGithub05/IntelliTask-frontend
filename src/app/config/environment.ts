/**
 * Environment Configuration
 * This file provides centralized configuration management
 * for the application, including API URLs for different environments.
 */

export const environment = {
  production: false,
  apiUrl: getApiUrl(),
};

/**
 * Dynamically determine API URL based on the environment
 * Development (localhost): http://localhost:3000/api
 * Production: Uses relative /api path or environment-specific URL
 */
function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Development: localhost
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'http://localhost:3000/api';
    }

    // Staging/Production: use relative path or specific domain
    return '/api';
  }

  // Server-side rendering fallback
  return '/api';
}
