# Backend Deployment Guide

This guide covers the deployment of your backend application to various hosting providers and best practices for production environments.

## Prerequisites

Before deploying, ensure you have:

1. **Environment Variables** - All required environment variables are properly set
2. **Database** - Database is configured and accessible
3. **Dependencies** - All dependencies are installed
4. **Build** - Application is built for production
5. **Process Manager** - A process manager like PM2 is installed

## 1. Environment Setup

### Environment Variables

Create a `.env` file in your project root:

```sh
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
# Add other environment variables as needed
```

### Install Dependencies

```bash
# Install production dependencies only
npm install --production

# Or with Yarn
yarn install --production
```

## 2. Process Management

### PM2 (Recommended)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Create an ecosystem file (`ecosystem.config.js`):
   ```javascript
   module.exports = {
     apps: [{
       name: 'your-app-name',
       script: 'dist/index.js',
       instances: 'max',
       exec_mode: 'cluster',
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         NODE_OPTIONS: '--max_old_space_size=1024'
       },
       error_file: 'logs/error.log',
       out_file: 'logs/out.log',
       log_date_format: 'YYYY-MM-DD HH:mm:ss',
       merge_logs: true,
       time: true
     }]
   };
   ```

3. Start your application:
   ```bash
   pm2 start ecosystem.config.js
   ```

4. Save the process list and set up startup script:
   ```bash
   pm2 save
   pm2 startup
   ```

### Systemd (Alternative)

Create a service file at `/etc/systemd/system/your-app.service`:

```ini
[Unit]
Description=Your App
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/path/to/your/app
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable your-app
sudo systemctl start your-app
```

## 3. Reverse Proxy Setup

### Nginx Configuration

Create a configuration file at `/etc/nginx/sites-available/your-app`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Proxy Configuration
    location / {
        proxy_pass http://localhost:3000;  # Your app's port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files (if serving any)
    location /static/ {
        root /path/to/your/app/public;
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

## 4. SSL Certificate

### Let's Encrypt with Certbot

1. Install Certbot:
   ```bash
   # For Ubuntu/Debian
   sudo apt install certbot python3-certbot-nginx

   # For CentOS/RHEL
   sudo yum install certbot python3-certbot-nginx
   ```

2. Obtain and install certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. Set up automatic renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## 5. Database Setup

### PostgreSQL

1. Install PostgreSQL:
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib

   # CentOS/RHEL
   sudo yum install postgresql-server postgresql-contrib
   ```

2. Create database and user:
   ```sql
   CREATE DATABASE yourdb;
   CREATE USER youruser WITH ENCRYPTED PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE yourdb TO youruser;
   ```

3. Update connection string in your `.env`:
   ```
   DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/yourdb
   ```

## 6. Caching with Redis

1. Install Redis:
   ```bash
   # Ubuntu/Debian
   sudo apt install redis-server

   # CentOS/RHEL
   sudo yum install redis
   ```

2. Start and enable Redis:
   ```bash
   sudo systemctl start redis
   sudo systemctl enable redis
   ```

3. Update your `.env`:
   ```
   REDIS_URL=redis://localhost:6379
   ```

## 7. File Storage

### Local Storage

Ensure the uploads directory exists and has proper permissions:

```bash
mkdir -p /path/to/your/app/uploads
chown -R youruser:yourgroup /path/to/your/app/uploads
chmod 755 /path/to/your/app/uploads
```

### Cloud Storage (AWS S3)

1. Install AWS SDK:
   ```bash
   npm install @aws-sdk/client-s3
   ```

2. Update your `.env`:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   AWS_BUCKET_NAME=your_bucket_name
   ```

## 8. Logging and Monitoring

### PM2 Logs

```bash
# View logs
pm2 logs

# View logs in real-time
pm2 logs --lines 1000

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Winston Logger

Configure Winston in your application:

```typescript
// src/utils/logger.ts
import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join('logs', 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join('logs', 'combined.log') 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

## 9. Security Hardening

1. **Update Dependencies**:
   ```bash
   npm audit fix
   ```

2. **Set File Permissions**:
   ```bash
   # Restrict access to sensitive files
   chmod 600 /path/to/your/app/.env
   chmod 700 /path/to/your/app/logs
   ```

3. **Firewall Configuration** (UFW for Ubuntu):
   ```bash
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

4. **Fail2Ban**:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

## 10. Deployment Scripts

Create a deployment script (`deploy.sh`):

```bash
#!/bin/bash

# Exit on error
set -e

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Build the application
echo "Building application..."
npm run build

# Run database migrations
echo "Running migrations..."
npm run migrate:up

# Restart the application
echo "Restarting application..."
pm2 restart ecosystem.config.js

echo "Deployment completed successfully!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## 11. CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
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
      
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.10
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USERNAME }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/your/app
          git pull origin main
          npm install --production
          npm run build
          npm run migrate:up
          pm2 restart ecosystem.config.js
```

## 12. Monitoring and Alerts

### PM2 Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor application
pm2 monit
```

### Uptime Monitoring

1. **Uptime Kuma** (Self-hosted):
   ```bash
   docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
   ```

2. **Better Stack** (Cloud):
   - Sign up at [Better Stack](https://betterstack.com/)
   - Add your website URL
   - Set up email/SMS alerts

## 13. Backup Strategy

### Database Backup

Create a backup script (`scripts/backup.sh`):

```bash
#!/bin/bash

# Configuration
DB_NAME="yourdb"
DB_USER="youruser"
BACKUP_DIR="/path/to/backups"
DATE=$(date +"%Y%m%d_%H%M%S")

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
PGPASSWORD=yourpassword pg_dump -U $DB_USER -h localhost -d $DB_NAME > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Compress backup
gzip $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -type f -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"
```

Schedule with cron:
```bash
# Edit crontab
crontab -e

# Add this line to run daily at 2 AM
0 2 * * * /bin/bash /path/to/your/app/scripts/backup.sh
```

## 14. Scaling

### Horizontal Scaling

1. **Load Balancing**:
   - Use Nginx or HAProxy as a load balancer
   - Configure sticky sessions if using session-based auth

2. **Stateless Architecture**:
   - Store sessions in Redis instead of memory
   - Use a shared file storage or object storage for uploads

### Vertical Scaling

1. **Increase Resources**:
   - Upgrade server CPU/RAM
   - Optimize database queries and add indexes
   - Implement caching with Redis

## 15. Common Issues and Troubleshooting

### High CPU Usage

```bash
# Find the process using the most CPU
top

# Get detailed information about a process
ps -p <PID> -o %cpu,%mem,cmd

# Generate a CPU profile with Node.js
kill -USR1 <PID>
# Check the generated profile file
```

### Memory Leaks

```bash
# Monitor memory usage
pm2 monit

# Generate heap snapshot
pm2 describe <app_id> # Get the inspect port
# Then use Chrome DevTools to connect to the inspect port
```

### Database Connection Issues

```bash
# Check if database is running
sudo systemctl status postgresql  # or mysql

# Check connection count
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Check for locks
psql -c "SELECT * FROM pg_locks;"
```

## 16. Rollback Plan

1. **Code Rollback**:
   ```bash
   # Revert to previous commit
   git log  # Find the commit hash to revert to
   git checkout <commit_hash>
   
   # Restart the application
   pm2 restart ecosystem.config.js
   ```

2. **Database Rollback**:
   ```bash
   # If using migrations
   npx prisma migrate down
   
   # Or restore from backup
   psql -U youruser -d yourdb < backup.sql
   ```

## 17. Zero-Downtime Deployment

### Using PM2

```bash
# Start a rolling restart
pm2 reload ecosystem.config.js

# Or with a delay between restarts
pm2 reload ecosystem.config.js --update-env
```

### Using Nginx

```nginx
# In your server block
upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001 backup;
}

server {
    # ... other config ...
    
    location / {
        proxy_pass http://backend;
        # ... other proxy settings ...
    }
}
```

## 18. Performance Optimization

### Node.js Flags

Add these to your start script in `package.json`:

```json
{
  "scripts": {
    "start": "NODE_ENV=production NODE_OPTIONS='--max-old-space-size=1024' node dist/index.js"
  }
}
```

### Database Optimization

1. **Add Indexes**:
   ```sql
   -- Example index
   CREATE INDEX idx_users_email ON users(email);
   ```

2. **Optimize Queries**:
   - Use `EXPLAIN ANALYZE` to analyze slow queries
   - Avoid `SELECT *`
   - Use pagination for large datasets

## 19. Security Auditing

1. **Dependency Auditing**:
   ```bash
   npm audit
   npm audit fix
   ```

2. **Server Hardening**:
   ```bash
   # Install and run lynis
   sudo apt install lynis
   sudo lynis audit system
   ```

3. **SSL Labs Test**:
   - Test your SSL configuration at [SSL Labs](https://www.ssllabs.com/ssltest/)

## 20. Final Checklist

- [ ] All environment variables are set
- [ ] Database is properly backed up
- [ ] SSL certificate is valid
- [ ] Firewall rules are configured
- [ ] Monitoring is set up
- [ ] Error tracking is configured
- [ ] Backup system is working
- [ ] Deployment process is documented
- [ ] Rollback plan is tested
- [ ] Team is notified of the deployment

## Conclusion

This guide provides a comprehensive overview of deploying a Node.js backend application to production. Always:

1. Test your deployment process in a staging environment first
2. Have a rollback plan in place
3. Monitor your application after deployment
4. Keep your dependencies and server software up to date
5. Regularly review and update your security measures

For production-critical applications, consider using managed services like:
- AWS Elastic Beanstalk
- Google Cloud Run
- Heroku
- DigitalOcean App Platform
- Railway.app

These services can simplify deployment and scaling while providing additional features like automatic scaling, managed databases, and built-in monitoring.
