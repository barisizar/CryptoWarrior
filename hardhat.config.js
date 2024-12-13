require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        // Replace with your Ganache private key (without 0x prefix)
        "5ab372b7a1074f1871883cc7e919872cdc560d992d1a2bfc35526e1109fa4c69" // Your private key here
      ]
    }
  },
  paths: {
    sources: "./src/contracts",
    scripts: "./src/scripts",
    tests: "./src/test",
    cache: "./cache",
    artifacts: "./src/artifacts"
  }
};