#!/bin/bash

# Car Rental System - Frontend Deployment Script
# This script deploys the frontend using Docker Compose

set -e

echo "🚀 Starting Frontend Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Check if environment.prod.ts needs updating
echo "🔧 Checking production environment configuration..."
if grep -q "your-backend-domain.com" src/environments/environment.prod.ts; then
    echo "⚠️  Please update src/environments/environment.prod.ts with your backend domain before continuing."
    echo "   Current content:"
    cat src/environments/environment.prod.ts
    echo ""
    echo "Press Enter when you've updated the configuration..."
    read
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 20

# Check application health
echo "🏥 Checking application health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend is running successfully!"
    echo "🌐 Frontend URL: http://localhost"
    echo "📊 Health Check: http://localhost/health"
else
    echo "❌ Frontend health check failed. Check logs with: docker-compose logs -f frontend"
    exit 1
fi

echo "🎉 Frontend deployment completed successfully!"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f frontend"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Update: docker-compose up -d --build"
echo ""
echo "🔧 To update backend URL, edit src/environments/environment.prod.ts and rebuild"
