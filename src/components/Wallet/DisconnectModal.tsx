import React from 'react';

interface DisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: () => void;
}

export function DisconnectModal({ isOpen, onClose, onDisconnect }: DisconnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Disconnect Wallet</h2>
        <p className="text-gray-300 mb-6">Are you sure you want to disconnect your wallet?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}