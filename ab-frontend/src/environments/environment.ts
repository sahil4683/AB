/**
 * Environment configuration for development
 * This file is not tracked by git to allow local overrides
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,
  logLevel: 'debug',
  features: {
    adminPanel: true,
    contactForm: true,
    productCatalog: true,
  },
};
