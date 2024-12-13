require("@nomicfoundation/hardhat-ethers");
const hre = require("hardhat");

async function main() {
  try {
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // Deploy the contract
    const GameRewards = await hre.ethers.getContractFactory("GameRewards");
    console.log("Deploying GameRewards...");
    const gameRewards = await GameRewards.deploy();
    await gameRewards.waitForDeployment();

    // Get the deployed contract address
    const contractAddress = await gameRewards.getAddress();
    console.log("GameRewards deployed to:", contractAddress);

    // Verify the deployment
    console.log("\nVerifying deployment...");
    const balance = await gameRewards.getBalance();
    console.log("Initial contract balance:", balance.toString());

    // Log the deployment details for easy reference
    console.log("\nDeployment details:");
    console.log("--------------------");
    console.log("Contract address:", contractAddress);
    console.log("Deployer address:", deployer.address);
    console.log("Network:", network.name);

    // Return the contract address for potential script chaining
    return contractAddress;
  } catch (error) {
    console.error("\nDeployment failed:", error);
    throw error;
  }
}

main()
  .then((address) => {
    console.log("\nDeployment successful! Use this address in your frontend constants:");
    console.log(`export const CONTRACT_ADDRESS = "${address}";`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });