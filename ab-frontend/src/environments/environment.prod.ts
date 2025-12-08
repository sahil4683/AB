/**
 * Environment configuration for production
 */

export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  apiTimeout: 30000,
  logLevel: 'error',
  features: {
    adminPanel: true,
    contactForm: true,
    productCatalog: true,
  },
};
