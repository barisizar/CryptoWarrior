export function formatAddress(address: string): string {
  if (!address) return '';
  
  // Return first 6 and last 4 characters of the address
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
} 