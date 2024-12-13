import React, { useState } from 'react';
import { useGameContract } from '../../hooks/useGameContract';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('0.01');
  const [isDepositing, setIsDepositing] = useState(false);
  const { deposit, error, clearError } = useGameContract();

  if (!isOpen) return null;

  const handleDeposit = async () => {
    try {
      setIsDepositing(true);
      const success = await deposit(amount);
      if (success) {
        onClose();
      }
    } finally {
      setIsDepositing(false);
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
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-500 bg-opacity-20 text-red-300 rounded">
            {error}
            <button
              onClick={clearError}
              className="float-right text-red-300 hover:text-red-100"
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
            disabled={isDepositing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDepositing ? 'Depositing...' : 'Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}