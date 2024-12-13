import { ethers } from 'ethers';
import { TESTNET_RPC_URL } from '../config/constants';

let provider: ethers.JsonRpcProvider | null = null;
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

const DEFAULT_OPTIONS = {
  polling: true,
  pollingInterval: 4000,
};

async function waitAndRetry() {
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  connectionAttempts++;
}

export async function getProvider() {
  try {
    console.log(`Attempting to connect to Ganache at ${TESTNET_RPC_URL}`);
    
    while (connectionAttempts < MAX_ATTEMPTS) {
      if (provider) {
        try {
          // Test if the existing provider is still connected
          const network = await provider.getNetwork();
          console.log('Provider verified successfully', {
            chainId: network.chainId,
            name: network.name
          });
          return provider;
        } catch (error) {
          console.log('Existing provider failed, creating new one');
          provider = null;
        }
      }

      try {
        // Create new provider with correct v6 syntax
        provider = new ethers.JsonRpcProvider(TESTNET_RPC_URL, undefined, DEFAULT_OPTIONS);

        // Test the connection
        const block = await provider.getBlock('latest');
        if (!block) {
          throw new Error('Could not fetch latest block');
        }

        console.log('Connected to Ganache successfully', {
          blockNumber: block.number,
          timestamp: new Date(Number(block.timestamp) * 1000).toISOString()
        });

        connectionAttempts = 0;
        return provider;
      } catch (error) {
        console.error(`Connection attempt ${connectionAttempts + 1} failed:`, error);
        await waitAndRetry();
      }
    }

    throw new Error(`Failed to connect after ${MAX_ATTEMPTS} attempts. Please ensure Ganache is running at ${TESTNET_RPC_URL}`);
  } catch (error) {
    console.error('Provider initialization failed:', error);
    throw error;
  }
}

export async function getSigner(provider: ethers.JsonRpcProvider) {
  try {
    // Get accounts using RPC call
    const accounts = await provider.send('eth_accounts', []);
    console.log('Available accounts:', accounts);

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available in Ganache. Please check if Ganache is running with unlocked accounts.');
    }

    const signer = await provider.getSigner(accounts[0]);
    const address = await signer.getAddress();
    console.log(`Using account ${address} as signer`);

    // Verify signer by checking balance
    const balance = await provider.getBalance(address);
    console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

    return signer;
  } catch (error) {
    console.error('Signer initialization failed:', error);
    throw new Error('Failed to access wallet account. Please check Ganache connection and account availability.');
  }
}

export async function isNetworkAvailable() {
  try {
    const tempProvider = new ethers.JsonRpcProvider(TESTNET_RPC_URL, undefined, DEFAULT_OPTIONS);
    const network = await tempProvider.getNetwork();
    const chainId = network.chainId;
    return chainId > 0;
  } catch (error) {
    console.error('Network availability check failed:', error);
    return false;
  }
}

export function resetProvider() {
  provider = null;
  connectionAttempts = 0;
}