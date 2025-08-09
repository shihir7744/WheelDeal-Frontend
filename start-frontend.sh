#!/bin/bash

echo "Starting Car Rental System Frontend..."
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies."
        exit 1
    fi
    echo ""
fi

# Check if Angular CLI is installed globally
if ! command -v ng &> /dev/null; then
    echo "Installing Angular CLI globally..."
    npm install -g @angular/cli@19
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install Angular CLI."
        exit 1
    fi
    echo ""
fi

echo "Starting Angular development server..."
echo "Application will be available at: http://localhost:4200"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
ng serve --host 0.0.0.0 --port 4200

