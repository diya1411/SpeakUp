#!/usr/bin/env bash
# Quick start script for development

echo "🚀 Starting SpeakUp..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please add your API keys to backend/.env"
fi

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file for frontend"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add your API keys to backend/.env"
echo "2. Run the following in separate terminals:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm start"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:3000"
echo ""
