import React from 'react';
import { WalletConnect, WalletProvider } from './components/Wallet/WalletConnect';
import { GameContainer } from './components/Game/GameContainer';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Crypto Warrior</h1>
              <WalletConnect />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <GameContainer />
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;