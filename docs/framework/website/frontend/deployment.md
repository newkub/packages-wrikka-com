# Frontend Deployment Guide

This guide covers the deployment process for your frontend application, including best practices and common deployment targets.

## Build Your Application

Before deployment, you need to build your application for production:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the `dist` directory
```

## Deployment Targets

### 1. Static Hosting (Vercel, Netlify, GitHub Pages)

#### Vercel

1. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```
   
   Or connect your GitHub/GitLab/Bitbucket repository to Vercel for automatic deployments.

#### Netlify

1. Install Netlify CLI (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```
   
   Or connect your Git repository to Netlify for continuous deployment.

#### GitHub Pages

1. Update `vite.config.js` (for Vite) or `vue.config.js` (for Vue CLI):

   ```js
   // vite.config.js
   export default {
     base: process.env.NODE_ENV === 'production' ? '/repository-name/' : '/',
   }
   ```

2. Create a GitHub Actions workflow (`.github/workflows/deploy.yml`):

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '16'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
             branch: gh-pages
   ```

### 2. Traditional Web Server (Nginx, Apache)

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";
}
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/your/dist
    
    <Directory "/path/to/your/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Enable URL rewriting
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Enable gzip compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
</VirtualHost>
```

## Environment Variables

For environment variables in production:

1. **Build-time Variables**:
   - Prefix with `VITE_` for Vite
   - Stored in `.env.production`
   
   ```sh
   VITE_API_URL=https://api.example.com
   VITE_APP_TITLE=My App
   ```

2. **Runtime Variables**:
   - For server-side rendering or client-side runtime configuration
   - Inject during deployment or use a configuration endpoint

## Performance Optimization

### 1. Code Splitting

Vue Router's lazy loading:

```js
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]
```

### 2. Preload and Prefetch

```html
<!-- In your index.html -->
<link rel="preload" href="/assets/important-font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="prefetch" href="/assets/next-page.js">
```

### 3. Compression

- Enable gzip or Brotli compression on your web server
- Pre-compress files during build:

  ```bash
  # Install compression plugin
  npm install vite-plugin-compression --save-dev
  
  # Configure in vite.config.js
  import compress from 'vite-plugin-compress'
  
  export default {
    plugins: [
      compress()
    ]
  }
  ```

## Security Headers

Add security headers to your web server configuration:

### Nginx

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### Apache

```apache
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "no-referrer-when-downgrade"
Header set Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';"
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

## Monitoring and Error Tracking

### 1. Error Tracking

```js
// main.js
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'YOUR_DSN',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: 'production'
  });
}
```

### 2. Analytics

```js
// main.js
import VueGtag from 'vue-gtag-next'


if (import.meta.env.PROD) {
  app.use(VueGtag, {
    property: {
      id: 'GA_MEASUREMENT_ID'
    }
  })
}
```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linter
        run: npm run lint
        
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Production
        uses: some-deployment-action@v1
        with:
          token: ${{ secrets.DEPLOY_TOKEN }}
          environment: production
```

## Rollback Strategy

1. Keep previous versions of your application
2. Use versioned deployments
3. Implement health checks
4. Set up monitoring to detect issues quickly

## Post-Deployment Checklist

- [ ] Verify all routes work correctly
- [ ] Check console for errors
- [ ] Test on multiple devices/browsers
- [ ] Verify analytics are working
- [ ] Check performance metrics
- [ ] Ensure environment variables are properly set
- [ ] Test authentication flows
- [ ] Verify API endpoints are accessible
- [ ] Check for mixed content warnings (HTTP/HTTPS)

## Troubleshooting

### Common Issues

1. **Blank Page**
   - Check browser console for errors
   - Verify base URL is set correctly
   - Ensure JavaScript files are loading

2. **404 Errors**
   - Check if the server is configured for client-side routing
   - Verify file paths are correct

3. **Environment Variables**
   - Ensure all required variables are set in production
   - Rebuild after changing environment variables

4. **Performance Issues**
   - Check bundle size with `npm run build -- --report`
   - Enable gzip/Brotli compression
   - Optimize images and assets

5. **CORS Issues**
   - Configure CORS headers on your API
   - Check if API URL is correct

For more information, refer to the [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html) or your chosen deployment platform's documentation.
