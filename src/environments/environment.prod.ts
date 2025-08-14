export const environment = {
  production: true,
  apiUrl: (window as any).__env?.API_URL || 'https://wheeldeal-backend-production.up.railway.app/api',
  baseUrl: (window as any).__env?.BASE_URL || 'https://wheeldeal-backend-production.up.railway.app'
};
