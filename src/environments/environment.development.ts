export const environment = {
  production: true,
  apiUrl:
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : 'https://url-shortener-app-nrnh.vercel.app/api',
  trackingApiUrl: 'https://visitor-tracking-api.vercel.app/api/visit',
};
