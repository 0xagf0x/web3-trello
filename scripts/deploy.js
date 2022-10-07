/* 
To deploy:
1. npx hardhat clean
    this cleans hardhats config to make sure everyting is fine

2. npx hardhat node (if not using Goerli)
    this will generate a local blockchain with accounts/keys we can use

3. npx hardhat compile

4. npx hardhat test

5.
- localhost: npx hardhat run --network localhost scripts/deploy.js 
- goerli: npx hardhat run --network goerli scripts/deploy.js

*/

// deployed to:  0xDaba8744f0a2af91e807fCd8DF46BCf358fd6C84


const hre = require("hardhat");

async function main() {
  const ManagerContract = await hre.ethers.getContractFactory('Manager');
  const managerContract = await ManagerContract.deploy();

  // deploy
  await managerContract.deployed();
  console.log("Manager Contract deployed to:", managerContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


