// import { ethers } from 'hardhat';

// async function main() {
//   const [deployer] = "0x145b2f7b1a7a25d7";

//   console.log('Deploying contracts with the account:', deployer);
//   const balance = await ethers.provider.getBalance("0xD659cE50eF55A237fC5Ff92318873284BAa774D7");
//   console.log(`Balance: ${balance} ETH`);

//   const deployment = await ethers.deployContract('Bets');

//   console.log('Bets address:', await deployment.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const deployment = await ethers.deployContract('Bets');

  console.log('Bets address:', await deployment.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
