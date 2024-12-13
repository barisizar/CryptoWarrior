# Crypto Warrior 🎮

Crypto Warrior is an interactive web3 game where players dodge enemies while earning cryptocurrency rewards. This arcade-style game combines classic gameplay mechanics with blockchain technology, creating an engaging play-to-earn experience.

## Game Overview 🎯

Players control their warrior using mouse movements, dodging increasingly difficult waves of enemies. As players survive longer and score higher, they earn cryptocurrency rewards through smart contracts. The game features progressive difficulty scaling, with enemies becoming faster and more numerous as the score increases.

## Screenshots 📸

### Main Page
<img src="/assets/MainPage.png" alt="Main Page" />

The game's landing page features a clean interface with the game board, leaderboard, and wallet connection options. Players can easily access all game features and track their progress from this central hub.

### Gameplay
<img src="/assets/Gameplay.png" alt="Gameplay" />

During gameplay, players control their warrior (purple circle) while dodging incoming enemies (red circles). The difficulty increases over time, with enemies becoming faster and more numerous as your score grows.

### Deposit Modal
<img src="/assets/Deposit.png" alt="Deposit Modal" />

Players can easily deposit crypto to start playing through our intuitive deposit modal. This interface connects directly with your Web3 wallet for secure transactions.

## Technical Architecture 🏗️

### Game Engine
- Built with React 18 and TypeScript for smooth, responsive gameplay
- Custom game loop implementation for precise enemy spawning and collision detection
- TailwindCSS for responsive UI design
- State management using React hooks and TanStack Query

### Blockchain Integration
- **Smart Contracts**: Written in Solidity, handling token rewards and game state
- **Local Development**:
  - Ganache for local blockchain development and testing
  - Hardhat for smart contract development, testing, and deployment
  - Ethers.js for blockchain interactions
- **Web3 Integration**:
  - Wagmi hooks for simplified blockchain interactions
  - Viem for type-safe ethereum data handling
  - MetaMask and other Web3 wallet support

### Key Features
1. **Gameplay**:
   - Real-time collision detection
   - Dynamic difficulty scaling
   - Score-based progression system

2. **Blockchain**:
   - Smart contract-based reward system
   - Token earning mechanics
   - Secure wallet integration
   - Leaderboard stored on-chain

3. **Development Environment**:
   - Local blockchain testing with Ganache
   - Smart contract deployment scripts
   - Automated test suite for contracts
   - Development tools for both game and blockchain components

The project demonstrates the integration of traditional game development with modern web3 technologies, creating an engaging gaming experience while leveraging blockchain technology for transparent and secure reward distribution.

## Tech Stack 💻

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **Blockchain**: Viem, Wagmi
- **Development**: Vite
- **Smart Contracts**: Hardhat, Ethers.js
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React

## Prerequisites 📋

Before you begin, ensure you have installed:

- Node.js (v16 or higher)
- npm or yarn
- A Web3 wallet (e.g., MetaMask)
- Git

## Installation 🛠️

1. Clone the repository:
```bash
git clone https://github.com/your-username/crypto-warrior.git
cd crypto-warrior
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

## Development 🔧

To run the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

## Building for Production 🏗️

1. Create a production build:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Smart Contract Development 🔗

1. Install Hardhat dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Run tests:
```bash
npx hardhat test
```

4. Deploy contracts:
```bash
npx hardhat run scripts/deploy.ts --network <network-name>
```

## Code Quality 🧹

Run the linter:
```bash
npm run lint
# or
yarn lint
```

## Project Structure 📁

```
crypto-warrior/
├── src/
│   ├── components/     # React components
│   ├── contracts/      # Smart contract artifacts
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Root component
├── hardhat/           # Smart contract development
├── public/            # Static assets
└── vite.config.ts     # Vite configuration
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
