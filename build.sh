#!/bin/bash

# Build script for the vulnerable container

echo "Building vulnerable test application..."

# Build the Docker image
docker build -t vulnerable-app:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "Image: vulnerable-app:latest"
    echo ""
    echo "Next steps:"
    echo "1. Run the container: docker run -p 3000:3000 vulnerable-app:latest"
    echo "2. Scan with Trivy: trivy image vulnerable-app:latest"
else
    echo "❌ Docker build failed!"
    exit 1
fi
