#!/bin/bash

echo "🚀 Setting up GitHub repository for Gahanna Tattoo Forms Backend"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repo
echo "📦 Initializing git repository..."
git init

# Add all files
echo "📝 Adding files..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Gahanna Tattoo intake forms backend"

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub.com"
echo "2. Copy the repository URL"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin <your-repo-url>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Then follow DEPLOY.md for Railway deployment."
