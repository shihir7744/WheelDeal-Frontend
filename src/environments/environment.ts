export const environment = {
  production: false,
  apiUrl: (window as any).__env?.API_URL || 'http://localhost:8080/api',
  baseUrl: (window as any).__env?.BASE_URL || 'http://localhost:8080'
};
