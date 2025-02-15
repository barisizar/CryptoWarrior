export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
    "name": "getTopScores",
    "outputs": [{
      "components": [
        {"internalType": "address", "name": "player", "type": "address"},
        {"internalType": "uint256", "name": "score", "type": "uint256"},
        {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "internalType": "struct GameRewards.PlayerScore[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_score", "type": "uint256"}],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;