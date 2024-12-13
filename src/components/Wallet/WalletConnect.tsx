import React, { useState } from 'react';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletButton } from './WalletButton';
import { DisconnectModal } from './DisconnectModal';
import { useWallet } from '../../hooks/useWallet';
import { useGameContract } from '../../hooks/useGameContract';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WalletConnect() {
  const { isConnected, error, address, connectWallet, disconnectWallet, clearError } = useWallet();
  const { initContract } = useGameContract();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const handleConnect = async () => {
    if (isConnected) {
      setShowDisconnectModal(true);
    } else {
      await connectWallet();
      await initContract();
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDisconnectModal(false);
  };

  return (
    <div className="relative">
      <WalletButton
        isConnected={isConnected}
        address={address}
        onClick={handleConnect}
      />
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
      <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onDisconnect={handleDisconnect}
      />
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