#!/bin/bash

# Test script for Gahanna Tattoo Forms Backend
# Usage: ./test-backend.sh YOUR_RAILWAY_URL

if [ -z "$1" ]; then
    echo "Usage: ./test-backend.sh YOUR_RAILWAY_URL"
    echo "Example: ./test-backend.sh https://gahanna-tattoo-forms.up.railway.app"
    exit 1
fi

BACKEND_URL=$1

echo "🧪 Testing Gahanna Tattoo Forms Backend"
echo "Backend URL: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing health check..."
curl -s "$BACKEND_URL/health" | jq '.' || echo "❌ Health check failed"
echo ""

# Test 2: Dropbox Connection
echo "2️⃣ Testing Dropbox connection..."
curl -s "$BACKEND_URL/api/test-dropbox" | jq '.' || echo "❌ Dropbox test failed"
echo ""

echo "✅ Basic tests complete!"
echo ""
echo "If both tests passed, your backend is ready!"
echo "Next: Send this URL to Sophia to update the forms."
