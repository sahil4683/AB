# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`ng lint`)
- [ ] Build successful (`npm run build:prod`)
- [ ] Environment variables configured
- [ ] API endpoint updated for target environment
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Accessibility testing completed

## Development Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Navigate to http://localhost:4200
```

## Production Deployment

### Build for Production

```bash
# Clean previous builds
rm -rf dist/

# Build optimized production bundle
npm run build:prod

# Check bundle size
ng build:prod --stats-json
webpack-bundle-analyzer dist/*/stats.json
```

### Build Output Explanation

The production build generates:
- **main.[hash].js** - Main application bundle
- **polyfills.[hash].js** - Polyfills for browser compatibility
- **styles.[hash].css** - Global styles
- **index.html** - Entry HTML file

All files include content hashes for cache busting.

## Deployment Targets

### 1. Azure Static Web Apps

#### Prerequisites
- Azure account
- Azure CLI installed
- GitHub repository (for CI/CD)

#### Deployment Steps

```bash
# 1. Create Azure Static Web App
az staticwebapp create \
  --name ab-frontend \
  --resource-group your-resource-group \
  --source https://github.com/your-username/ab-frontend \
  --location centralus \
  --branch main

# 2. GitHub Actions automatically deploys on push to main
```

#### Configuration File (`azure-pipelines.yml`)
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'

  - script: npm install
    displayName: 'npm install'

  - script: npm run build:prod
    displayName: 'npm build:prod'

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: 'dist'
      artifactName: 'app'
```

### 2. Azure App Service

#### Prerequisites
- Azure account
- Azure CLI installed
- Node.js runtime selected

#### Deployment Steps

```bash
# 1. Create App Service
az appservice plan create \
  --name ab-frontend-plan \
  --resource-group your-resource-group \
  --sku B1

az webapp create \
  --resource-group your-resource-group \
  --plan ab-frontend-plan \
  --name ab-frontend-app \
  --runtime "node|20"

# 2. Configure for Angular SPA
az webapp config appsettings set \
  --resource-group your-resource-group \
  --name ab-frontend-app \
  --settings SCM_REPOSITORY_PATH=/tmp/artifacts

# 3. Deploy via zip
zip -r dist.zip dist/
az webapp deployment source config-zip \
  --resource-group your-resource-group \
  --name ab-frontend-app \
  --src dist.zip
```

### 3. Docker Container

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy build output
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Build and Push Docker Image

```bash
# Build image
docker build -t ab-frontend:latest .

# Tag for registry
docker tag ab-frontend:latest myregistry.azurecr.io/ab-frontend:latest

# Push to Azure Container Registry
docker push myregistry.azurecr.io/ab-frontend:latest

# Run locally for testing
docker run -p 3000:3000 ab-frontend:latest
```

### 4. GitHub Pages

#### Deploy to GitHub Pages

```bash
# 1. Update angular.json with base href
# "baseHref": "/ab-frontend/"

# 2. Build with base href
ng build --configuration production --base-href "/ab-frontend/"

# 3. Deploy using gh-pages package
npx gh-pages -d dist/ab-frontend

# 4. Repository settings:
# - Go to Settings > Pages
# - Source: Deploy from branch
# - Branch: gh-pages
```

### 5. Netlify

#### Deploy via Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build production bundle
npm run build:prod

# 3. Deploy
netlify deploy --prod --dir=dist

# Or connect repository for automatic deployments
netlify init
```

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 6. Vercel

#### Deploy via Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow prompts to connect project
```

## Environment Configuration

### Set API Endpoint for Deployment

Update `src/environments/environment.prod.ts`:

```typescript
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
```

### Build with Environment

```bash
# Development
ng build --configuration development

# Production (uses environment.prod.ts)
ng build --configuration production
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Build for production
        run: npm run build:prod

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Azure
        uses: azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: 'dist'
          output_location: ''
```

## Monitoring and Logging

### Application Insights Integration

```typescript
// Configure Application Insights for monitoring
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'YOUR_KEY_HERE',
    enableAutoRouteTracking: true,
  }
});

appInsights.loadAppInsights();
```

### Log Levels by Environment

**Development**:
- Log Level: DEBUG
- Log console output
- Verbose error messages

**Production**:
- Log Level: ERROR
- Send errors to Application Insights
- No sensitive information in logs

## Rollback Strategy

### If deployment fails:

1. **Check error logs**
```bash
# Azure
az webapp log tail --name ab-frontend-app --resource-group your-resource-group

# Docker
docker logs container-id
```

2. **Rollback to previous version**
```bash
# Azure deployment slots
az webapp deployment slot swap --name ab-frontend-app --slot staging

# GitHub Pages
# Revert push or redeploy previous build
git revert <commit-hash>
git push origin main
```

## Performance Optimization for Production

### 1. Enable Compression
```
# Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Apache
mod_deflate enabled
```

### 2. Set Cache Headers
```
# Static assets (with hash)
Cache-Control: public, max-age=31536000, immutable

# index.html
Cache-Control: public, max-age=0, must-revalidate
```

### 3. CDN Integration
```typescript
// Update API URL for CDN
const apiUrl = environment.production 
  ? 'https://cdn.yourdomain.com/api'
  : 'http://localhost:8080/api';
```

## Security in Production

### HTTPS/SSL
- All deployments must use HTTPS
- Enforce HSTS headers

### CORS Configuration
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Troubleshooting

### Build Size Too Large
```bash
# Analyze bundle
ng build:prod --stats-json
webpack-bundle-analyzer dist/*/stats.json

# Solutions:
# - Enable differential loading
# - Remove unused dependencies
# - Lazy load modules
```

### Slow API Responses
- Check API server logs
- Monitor network latency
- Consider caching strategies
- Implement pagination

### White Screen of Death
- Check browser console for errors
- Verify API endpoint is accessible
- Check environment configuration
- Verify base href setting

---

**Version**: 1.0.0  
**Last Updated**: December 2024
