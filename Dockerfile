# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application with better error handling
RUN echo "=== Starting Angular build ===" && \
    ng build --configuration production && \
    echo "=== Angular build completed ===" && \
    echo "=== Contents of app directory ===" && \
    ls -la && \
    echo "=== Contents of dist directory ===" && \
    ls -la dist/ && \
    echo "=== Contents of dist/frontend directory ===" && \
    ls -la dist/frontend/ && \
    echo "=== Checking for index.html ===" && \
    if [ -f dist/frontend/index.html ]; then \
        echo "SUCCESS: index.html found in dist/frontend/"; \
        ls -la dist/frontend/ | grep -E "\.(html|js|css)$"; \
    else \
        echo "ERROR: index.html not found in dist/frontend/"; \
        echo "Build output directory contents:"; \
        find dist/ -type f -name "*.html" -o -name "*.js" -o -name "*.css" || echo "No HTML/JS/CSS files found"; \
        exit 1; \
    fi

# Production stage
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache bash

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built application - with verification
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Verify what was copied
RUN echo "=== Nginx HTML Directory Contents ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "=== Checking for index.html ===" && \
    if [ -f /usr/share/nginx/html/index.html ]; then \
        echo "index.html found - Angular app copied successfully"; \
        echo "First few lines of index.html:"; \
        head -5 /usr/share/nginx/html/index.html; \
    else \
        echo "ERROR: index.html not found - Angular app copy failed"; \
        exit 1; \
    fi

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf.template

# Create startup script
RUN echo '#!/bin/bash' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'echo "=== Starting nginx with PORT: ${PORT:-80} ==="' >> /docker-entrypoint.sh && \
    echo 'export PORT=${PORT:-80}' >> /docker-entrypoint.sh && \
    echo 'echo "=== Contents of nginx html directory ==="' >> /docker-entrypoint.sh && \
    echo 'ls -la /usr/share/nginx/html/' >> /docker-entrypoint.sh && \
    echo 'echo "=== Updating nginx config with PORT: $PORT ==="' >> /docker-entrypoint.sh && \
    echo 'envsubst "\$PORT" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf' >> /docker-entrypoint.sh && \
    echo 'echo "=== Nginx config updated ==="' >> /docker-entrypoint.sh && \
    echo 'cat /etc/nginx/nginx.conf | grep "listen"' >> /docker-entrypoint.sh && \
    echo 'echo "=== Starting nginx ==="' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port (will be overridden by Railway)
EXPOSE 80

# Start nginx with environment variable substitution
CMD ["/docker-entrypoint.sh"]
