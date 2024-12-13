import React from 'react';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WalletConnect() {
  const { isConnected, error, address, connectWallet, clearError } = useWallet();

  return (
    <div className="relative">
      <button
        onClick={connectWallet}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        <Wallet className="w-5 h-5" />
        {isConnected ? (
          <span className="font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        ) : (
          'Connect Wallet'
        )}
      </button>
      {error && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-red-500 text-white rounded-lg shadow-lg">
          <p className="text-sm">{error}</p>
          <button
            onClick={clearError}
            className="absolute top-1 right-1 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}