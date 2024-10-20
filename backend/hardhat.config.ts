import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const { vars } = require("hardhat/config");
const FLOW_PRIVATE_KEY = vars.get("FLOW_PRIVATE_KEY")
const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
      testnet: {
        url: `https://testnet.evm.nodes.onflow.org`,
        accounts: [FLOW_PRIVATE_KEY],
        gas: 1000,
      }
    }
  };

export default config;
