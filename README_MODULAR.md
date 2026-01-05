# Orion Modular - Enterprise Arbitrage Trading System

> A modern, modular, enterprise-grade arbitrage flash loan backend service built with TypeScript, Node.js, and cutting-edge AI integration.

## 🏗️ Architecture Overview

Orion Modular is a complete rewrite of the Orion arbitrage system featuring a modern, modular architecture designed for enterprise-scale deployment.

### Core Principles
- **🔧 Modularity**: Clear separation of concerns with independent, testable modules
- **📈 Scalability**: Horizontal and vertical scaling capabilities
- **🛡️ Security**: Enterprise-grade security with comprehensive authentication
- **🚀 Performance**: Intelligent caching and optimization strategies
- **🧪 Testability**: Comprehensive testing framework with high coverage

## 📁 Project Structure

```
orion-modular/
├── src/                              # Main source directory
│   ├── app.ts                        # Main Express application
│   ├── index.ts                      # Application entry point
│   ├── config/                       # Configuration management
│   ├── core/                         # Core business logic
│   │   ├── ai/                       # Unified AI services (TypeScript)
│   │   │   ├── index.ts              # AI service implementation
│   │   │   ├── types.ts              # AI service types
│   │   │   └── cache.ts              # AI caching system
│   │   ├── blockchain/               # Blockchain interactions
│   │   └── orchestrator/             # Bot orchestration (Tri-Tier)
│   ├── infrastructure/               # Infrastructure concerns
│   │   ├── api/                      # API routes & controllers
│   │   │   └── routes/               # RESTful route handlers
│   │   ├── database/                 # Data models & repositories
│   │   │   ├── models/               # Mongoose models (TypeScript)
│   │   │   └── index.ts              # Database service
│   │   ├── monitoring/               # Logging & metrics
│   │   └── security/                 # Authentication & middleware
│   │       └── middleware.ts         # Security middleware
│   └── shared/                       # Shared utilities & types
│       ├── types/                    # TypeScript definitions
│       ├── utils/                    # Common utilities
│       ├── constants/                # Application constants
│       └── container.ts              # Dependency injection
├── tests/                            # Unified test suite
│   ├── setup.ts                      # Test environment setup
│   └── unit/                         # Unit tests
├── docs/                             # Documentation
├── scripts/                          # Build and deployment scripts
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── jest.config.js                    # Testing configuration
└── Dockerfile                        # Container configuration
```

## 🚀 Key Features

### 🤖 AI-Powered Trading
- **Intelligent Strategy Optimization**: AI-driven arbitrage strategy selection
- **Wallet Analysis**: Forensic blockchain analysis with ML classification
- **Token Security Auditing**: Automated smart contract security assessment
- **Real-time Decision Making**: AI-powered trade execution decisions

### ⚡ Tri-Tier Bot Architecture
- **Scanners (Tier 1)**: High-frequency mempool/blockchain monitoring
- **Captain (Tier 2)**: AI-powered orchestration and decision making
- **Executors (Tier 3)**: Flash loan execution and transaction management

### 🔒 Enterprise Security
- **API Key Authentication**: Secure API access control
- **Rate Limiting**: Configurable request throttling
- **Input Sanitization**: XSS protection and validation
- **Security Headers**: Comprehensive security header implementation

### 📊 Multi-Chain Support
- **Ethereum**: Full support with flash loan providers
- **Base**: Optimism L2 integration
- **Arbitrum**: Layer 2 arbitrage opportunities

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.8+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis for high-performance caching

### AI & ML
- **AI Provider**: Google Gemini 1.5 Flash
- **Caching**: Intelligent response caching (5min TTL)
- **Retry Logic**: Exponential backoff for API resilience

### DevOps & Testing
- **Testing**: Jest with TypeScript support
- **Linting**: ESLint with TypeScript rules
- **Container**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions automation

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Redis (optional, for caching)
- Docker (for containerized deployment)

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd orion-modular

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure environment variables
nano .env

# Run in development mode
npm run dev

# Build for production
npm run build
npm start
```

## ⚙️ Configuration

### Environment Variables
```env
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/orion
REDIS_URL=redis://localhost:6379

# AI Service
GEMINI_API_KEY=your-gemini-api-key

# Blockchain
PRIVATE_KEY=your-private-key
PIMLICO_API_KEY=your-pimlico-key
INFURA_PROJECT_ID=your-infura-id

# Security
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key
```

## 🔌 API Endpoints

### Health & Monitoring
- `GET /api/health` - Service health status
- `GET /api/bots/status` - Bot orchestrator status

### Strategy Management
- `GET /api/strategies` - List all strategies
- `POST /api/strategies` - Create new strategy
- `GET /api/strategies/:id` - Get strategy by ID
- `PUT /api/strategies/:id` - Update strategy
- `DELETE /api/strategies/:id` - Delete strategy

### AI Services
- `POST /api/ai/analyze` - Analyze wallet behavior
- `POST /api/ai/audit` - Audit token security

### Blockchain
- `GET /api/blockchain/status` - Blockchain connection status

### Bot Control
- `POST /api/bots/start` - Start bot system
- `POST /api/bots/stop` - Stop bot system

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/unit/aiService.test.ts
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t orion-modular .

# Run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale orion-backend=3
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name orion-modular
```

## 📊 Monitoring & Observability

### Health Checks
- Automatic health monitoring of all services
- Database connection status
- AI service availability
- Blockchain connectivity

### Logging
- Structured logging with Winston
- Log levels: error, warn, info, debug
- Centralized log aggregation ready

### Metrics
- Response time tracking
- Error rate monitoring
- Cache hit/miss ratios
- Bot performance metrics

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
```

### Architecture Decisions
- **Modular Design**: Each module has single responsibility
- **Dependency Injection**: Clean service dependencies with Inversify
- **Type Safety**: 100% TypeScript coverage
- **Test-Driven**: Comprehensive test suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AI Integration**: Powered by Google Gemini AI
- **Blockchain**: Ethereum, Base, and Arbitrum networks
- **Flash Loans**: Aave V3, Compound V3, and custom providers
- **Architecture**: Inspired by enterprise software patterns

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

**Built with ❤️ for the DeFi community**
