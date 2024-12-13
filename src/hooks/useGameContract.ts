import { useState, useCallback, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { useWallet } from './useWallet';
import { CONTRACT_ADDRESS } from '../config/constants';
import { CONTRACT_ABI } from '../config/contract';

export function useGameContract() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signer, isConnected, provider } = useWallet();

  const initContract = useCallback(async () => {
    if (!signer || !provider) {
      setError('Wallet not connected');
      return;
    }

    try {
      // First verify the contract address is valid
      if (!ethers.isAddress(CONTRACT_ADDRESS)) {
        throw new Error('Invalid contract address format');
      }

      // Check if contract is deployed
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x' || code === '0x0') {
        // If you're in development, you might want to deploy the contract
        console.warn('Contract not deployed at address:', CONTRACT_ADDRESS);
        throw new Error('Contract not deployed. Please deploy the contract first.');
      }

      // Initialize contract with both provider and signer
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      ).connect(signer);
      
      try {
        // Verify contract interface by calling a view function
        await gameContract.getBalance();
      } catch (callError: any) {
        // If the function call fails, it might be because of ABI mismatch
        if (callError.message.includes('call revert exception')) {
          throw new Error('Contract ABI mismatch. Please verify the contract implementation.');
        }
        throw callError;
      }
      
      setContract(gameContract);
      setError(null);
            
    } catch (err: any) {
      let errorMessage = 'Failed to initialize contract';
      
      if (err.message.includes('contract not deployed')) {
        errorMessage = 'Contract not deployed. Please deploy the contract first.';
      } else if (err.message.includes('ABI mismatch')) {
        errorMessage = 'Contract interface mismatch. Please verify the contract implementation.';
      } else if (err.message.includes('invalid address')) {
        errorMessage = 'Invalid contract address. Please verify the address.';
      }
      
      console.error('Contract initialization error:', {
        message: err.message,
        address: CONTRACT_ADDRESS,
        error: err
      });
      
      setError(errorMessage);
      setContract(null);
    }
  }, [signer, provider]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (isConnected && signer && mounted) {
        await initContract();
      } else if (!isConnected) {
        setContract(null);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [isConnected, signer, initContract]);

  // Rest of the contract functions remain the same...
const deposit = useCallback(async (amount: string) => {
  if (!contract || !signer) {
    setError('Contract not initialized or wallet not connected');
    return false;
  }

  try {
    console.log('Starting deposit process...');
    const amountInWei = ethers.parseEther(amount);
    
    // Check minimum deposit
    const minDeposit = ethers.parseEther('0.01');
    if (amountInWei < minDeposit) {
      throw new Error('Minimum deposit is 0.01 ETH');
    }

    // Submit transaction
    console.log('Submitting deposit transaction...');
    const tx = await contract.deposit({
      value: amountInWei,
      gasLimit: 100000
    });

    console.log('Transaction submitted:', tx.hash);
    
    // Wait for confirmation
    console.log('Waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    // Verify the deposit
    const balance = await contract.getBalance();
    console.log('New balance:', ethers.formatEther(balance));

    return true;
  } catch (err: any) {
    console.error('Deposit error:', err);
    if (err.message.includes('user rejected')) {
      setError('Transaction was rejected');
    } else if (err.message.includes('insufficient funds')) {
      setError('Insufficient funds in wallet');
    } else {
      setError(err.message || 'Failed to deposit');
    }
    return false;
  }
}, [contract, signer]);

  const getBalance = useCallback(async (): Promise<string> => {
    if (!contract || !signer) {
      return '0';
    }

    try {
      const balance = await contract.getBalance();
      return ethers.formatEther(balance);
    } catch (err) {
      console.error('Balance fetch error:', err);
      setError('Failed to fetch balance');
      return '0';
    }
  }, [contract, signer]);

  const getLeaderboard = useCallback(async (limit: number = 10) => {
    if (!contract) return [];

    try {
      const scores = await contract.getTopScores(limit);
      return scores.map((score: any) => ({
        player: score.player,
        score: Number(score.score),
        timestamp: Number(score.timestamp)
      }));
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError('Failed to fetch leaderboard');
      return [];
    }
  }, [contract]);

  const submitScore = useCallback(async (score: number) => {
    if (!contract || !signer) return false;

    try {
      const tx = await contract.submitScore(score);
      await tx.wait();
      return true;
    } catch (err) {
      console.error('Score submission error:', err);
      setError('Failed to submit score');
      return false;
    }
  }, [contract, signer]);

const getPlayerBalance = useCallback(async (): Promise<string> => {
  if (!contract || !signer) {
    return '0';
  }

  try {
    const address = await signer.getAddress();
    // Use getBalance() instead since that's the view function in your contract
    const balance = await contract.getBalance();
    return ethers.formatEther(balance);
  } catch (err) {
    console.error('Balance fetch error:', err);
    setError('Failed to fetch balance');
    return '0';
  }
}, [contract, signer]);

const checkCanPlay = useCallback(async (): Promise<boolean> => {
  if (!contract || !signer) {
    return false;
  }

  try {
            console.log("HERE5")

    const balance = await getPlayerBalance();
    return Number(balance) > 0;
  } catch (err) {
    console.error('Play check error:', err);
    return false;
  }
}, [contract, signer, getPlayerBalance]);

  return {
    contract,
    initContract,
    deposit,
    submitScore,
    getLeaderboard,
    getBalance,
    error,
    clearError: () => setError(null),
    getPlayerBalance,
    checkCanPlay
  };
}