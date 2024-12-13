import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletButtonProps {
  isConnected: boolean;
  address: string | null;
  onClick: () => void;
}

export function WalletButton({ isConnected, address, onClick }: WalletButtonProps) {
  return (
    <button
      onClick={onClick}
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
  );
}