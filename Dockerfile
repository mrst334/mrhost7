# Use nginx as base image for serving static files
FROM nginx:alpine

# Copy built files to nginx directory
COPY dist/spa /usr/share/nginx/html

# Create custom nginx configuration with correct MIME types
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Add MIME type mappings
    location ~* \.js$ {
        add_header Content-Type "application/javascript; charset=utf-8" always;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        add_header Access-Control-Allow-Origin "*" always;
    }

    location ~* \.mjs$ {
        add_header Content-Type "application/javascript; charset=utf-8" always;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        add_header Access-Control-Allow-Origin "*" always;
    }

    location ~* \.css$ {
        add_header Content-Type "text/css; charset=utf-8" always;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    location ~* \.html$ {
        add_header Content-Type "text/html; charset=utf-8" always;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # React Router support - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Assets caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable" always;
    }

    # Error handling
    error_page 404 /index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
EOF

# Update nginx.conf to use custom port
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/nginx.conf

# Add MIME types to main nginx config
RUN cat >> /etc/nginx/nginx.conf << 'EOF'

# Additional MIME types
http {
    include       /etc/nginx/mime.types;
    
    # Ensure JavaScript files are served with correct MIME type
    location ~* \.js$ {
        add_header Content-Type "application/javascript; charset=utf-8";
    }
    
    location ~* \.mjs$ {
        add_header Content-Type "application/javascript; charset=utf-8";
    }
}
EOF

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
