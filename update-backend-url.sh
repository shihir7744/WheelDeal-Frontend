#!/bin/bash

echo "========================================"
echo "    Update Backend URL for Deployment"
echo "========================================"
echo

echo "This script will help you update the backend URL for deployment."
echo

read -p "Enter your backend URL (e.g., https://your-backend.railway.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "Error: Backend URL cannot be empty"
    exit 1
fi

echo
echo "Updating environment configuration..."
echo "Backend URL: $BACKEND_URL"
echo

# Update the env.js file
cat > frontend/src/assets/env.js << EOF
// Runtime environment configuration
// This file can be modified during deployment to set environment variables
window.__env = {
  // Backend API URL - Update this for your deployment
  API_URL: '$BACKEND_URL/api',
  
  // Backend Base URL - Update this for your deployment  
  BASE_URL: '$BACKEND_URL',
  
  // Environment name
  ENVIRONMENT: 'production'
};
EOF

echo "✅ Environment configuration updated successfully!"
echo
echo "Next steps:"
echo "1. Rebuild your frontend: npm run build:prod"
echo "2. Deploy the updated frontend"
echo "3. Test login with demo accounts"
echo
