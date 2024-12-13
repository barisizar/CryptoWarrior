/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>;
    on: (event: string, callback: () => void) => void;
    removeListener: (event: string, callback: () => void) => void;
    selectedAddress: string | null;
  };
}