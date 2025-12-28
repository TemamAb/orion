# Live Executive Dashboard

This is the unified AION Architect Core dashboard, a comprehensive flash loan arbitrage trading interface with **real blockchain connectivity**.

## Features

- **Real-time Metrics**: Profit per hour, trades per hour, total profit tracking
- **Live Blockchain Integration**: MetaMask wallet connection and real ETH balance fetching
- **Command Center**: Wallet connection and withdrawal management
- **Strategy Analytics**: Breakdown by strategies, chains, and pairs
- **Flash Loan Analytics**: Borrowing volume, gas efficiency, loan counts
- **AI Optimization**: Cycle tracking and delta optimization
- **Security & MEV Shield**: Attack prevention and honeypot detection
- **Live Event Stream**: Real-time blockchain events and telemetry
- **System Health**: Node status monitoring

## Blockchain Integration

The dashboard now includes:
- **MetaMask Integration**: Real wallet connection and balance fetching
- **Ethers.js Library**: Full Ethereum blockchain interaction capabilities
- **Live Balance Updates**: Fetches real ETH balance from connected wallet
- **Transaction Monitoring**: Real-time blockchain event simulation
- **Secure Connections**: All interactions use encrypted RPC connections

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. The `vercel.json` is already configured to serve the HTML file directly
3. Deploy - Vercel will automatically serve the `live-executivedashbaord.html` file

### Render Deployment

1. Connect your GitHub repository to Render
2. Create a new Static Site
3. The `render.yaml` is configured to serve the HTML file from root directory
4. Deploy

## File Structure

- `live-executivedashbaord.html` - The unified dashboard with blockchain integration
- `vercel.json` - Vercel configuration for static HTML serving
- `render.yaml` - Render configuration for static site hosting

## Security Features

- All transfers recorded on-chain
- Multi-signature confirmation for large settlements
- MEV attack prevention
- Front-running neutralization
- Honeypot detection
- MetaMask secure wallet connections

## Architecture

The dashboard utilizes:
- **Ethers.js 6.11.1**: Full Ethereum blockchain interaction
- **MetaMask Integration**: Secure wallet connectivity
- **Real-time Data**: Live blockchain balance and transaction monitoring
- **Responsive Design**: Mobile and desktop optimized
- **Dark Theme**: Optimized for trading interfaces
- **No Build Process**: Pure HTML/CSS/JS deployment ready

## Requirements

- Modern web browser with MetaMask extension
- Ethereum network connection
- Internet connectivity for real-time updates