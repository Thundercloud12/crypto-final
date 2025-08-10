# CryptoTracker - Real-Time Cryptocurrency Tracking Application

A modern cryptocurrency tracking application built with React and Node.js that provides real-time price updates, technical analysis, and portfolio management features.

## Features

- 🚀 Real-time cryptocurrency price updates via Binance WebSocket
- 📊 Technical analysis indicators (RSI, MACD, SMA)
- ⭐ Favorite cryptocurrencies management
- 📈 Interactive price charts and sparklines
- 🔍 Detailed cryptocurrency information pages
- 💹 Live trade monitoring
- 🌓 Responsive design with dark mode support

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS with DaisyUI
- **Real-time Data**: WebSocket connections
- **Charting**: React-Sparklines
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Technical Analysis**: technicalindicators library
- **APIs**: Integration with Binance WebSocket API

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot-reloading enabled
- **Production**: Nginx for serving static files

## Project Structure
\`\`\`
crypto-app/
├── backend/                # Node.js backend server
│   ├── services/          # Business logic services
│   │   ├── cryptoAnalysis.js
│   │   ├── stockService.js
│   │   └── technicalAnalysis.js
│   └── index.js          # Express server setup
├── crypto-app/           # React frontend application
│   ├── src/
│   │   ├── api/         # API integration
│   │   ├── store/       # Redux store configuration
│   │   │   └── slices/  # Redux slices
│   │   ├── components/  # React components
│   │   └── pages/       # Route pages
│   └── public/          # Static assets
└── docker-compose.yml   # Docker composition
\`\`\`

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Local Development
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Thundercloud12/crypto-app.git
   cd crypto-app
   \`\`\`

2. Install dependencies for both frontend and backend:
   \`\`\`bash
   # Frontend dependencies
   cd crypto-app
   npm install

   # Backend dependencies
   cd ../backend
   npm install
   \`\`\`

3. Start the development servers:
   \`\`\`bash
   # Start backend (from backend directory)
   npm start

   # Start frontend (from crypto-app directory)
   npm run dev
   \`\`\`

### Docker Deployment
1. Build and run with Docker Compose:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

## Features in Detail

### Real-Time Price Updates
- WebSocket connection to Binance for live price updates
- Automatic reconnection handling
- Efficient data batching for performance

### Technical Analysis
- RSI (Relative Strength Index) calculation
- MACD (Moving Average Convergence Divergence)
- SMA (Simple Moving Average)
- Trend analysis and predictions

### User Features
- Favorite cryptocurrency management
- Detailed view for each cryptocurrency
- Price history visualization
- Market statistics and trends

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Binance API for real-time cryptocurrency data
- TailwindCSS and DaisyUI for the UI components
- React community for excellent tools and libraries
