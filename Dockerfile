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

# Build the application with production configuration
RUN npm run build:prod

# Debug: Show build output structure
RUN echo "=== Build Output Structure ===" && \
    ls -la && \
    echo "=== dist directory ===" && \
    ls -la dist/ && \
    echo "=== dist/frontend directory ===" && \
    ls -la dist/frontend/ || echo "dist/frontend not found"

# Production stage
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache bash

# Copy built application - try multiple possible locations
COPY --from=build /app/dist/frontend /usr/share/nginx/html/ || \
COPY --from=build /app/dist /usr/share/nginx/html/ || \
COPY --from=build /app/dist/frontend/* /usr/share/nginx/html/ || \
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Debug: Show what was copied
RUN echo "=== Nginx HTML Directory Contents ===" && \
    ls -la /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf.template

# Create startup script
RUN echo '#!/bin/bash' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'echo "=== Starting nginx with PORT: ${PORT:-80} ==="' >> /docker-entrypoint.sh && \
    echo 'export PORT=${PORT:-80}' >> /docker-entrypoint.sh && \
    echo 'echo "=== Current working directory ==="' >> /docker-entrypoint.sh && \
    echo 'pwd' >> /docker-entrypoint.sh && \
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
