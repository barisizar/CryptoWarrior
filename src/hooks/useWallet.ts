// useWallet.ts
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types/game';
import { getProvider, getSigner, isNetworkAvailable, resetProvider } from '../utils/ethereum';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    error: null,
    address: null,
    provider: null,
    signer: null
  });

  const connectWallet = useCallback(async () => {
    try {
      const available = await isNetworkAvailable();
      if (!available) {
        throw new Error('Network unavailable. Please check if Ganache is running.');
      }

      const provider = await getProvider();
      const signer = await getSigner(provider);
      const address = await signer.getAddress();

      setWalletState({
        isConnected: true,
        error: null,
        address,
        provider,
        signer
      });
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      resetProvider();
      setWalletState(prev => ({
        ...prev,
        isConnected: false,
        error: error.message || 'Failed to connect wallet',
        provider: null,
        signer: null,
        address: null
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    resetProvider();
    setWalletState({
      isConnected: false,
      error: null,
      address: null,
      provider: null,
      signer: null
    });
  }, []);

  const clearError = useCallback(() => {
    setWalletState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const attemptConnection = async () => {
      if (!mounted || walletState.isConnected) return;
      
      try {
        await connectWallet();
      } catch (error) {
        if (mounted) {
          retryTimeout = setTimeout(attemptConnection, 5000);
        }
      }
    };

    attemptConnection();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [connectWallet, walletState.isConnected]);

  return { ...walletState, connectWallet, disconnectWallet, clearError };
}