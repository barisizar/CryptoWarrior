import React, { useState } from 'react';
import { useGameContract } from '../hooks/useGameContract';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('0.01');
  const [isDepositing, setIsDepositing] = useState(false);
  const { deposit, error, clearError, getPlayerBalance } = useGameContract();

  if (!isOpen) return null;

const handleDeposit = async () => {
    try {
      setIsDepositing(true);
      clearError();
      
      const success = await deposit(amount);
      
      if (success) {
        // Check player's balance after deposit
        const newBalance = await getPlayerBalance();
        await new Promise(resolve => setTimeout(resolve, 1000));
        onClose();
      }
    } catch (err: any) {
      console.error('Deposit error:', err);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
      setAmount(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Deposit ETH to Play</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Amount (ETH)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
          <p className="text-sm text-gray-400 mt-1">Minimum deposit: 0.01 ETH</p>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-500 bg-opacity-20 text-red-300 rounded flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-100 ml-2"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
            disabled={isDepositing}
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={isDepositing || parseFloat(amount) < 0.01}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDepositing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Depositing...
              </span>
            ) : (
              'Deposit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}