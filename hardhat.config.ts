import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-contract-sizer";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ganache";
import "hardhat-typechain";
import "solidity-coverage";
import "./tasks/accounts";
import "./tasks/clean";
dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let etherscanApiKey: string;
if (!process.env.ETHERSCAN_API_KEY) {
  throw new Error("Please set your ETHERSCAN_API_KEY in a .env file");
} else {
  etherscanApiKey = process.env.ETHERSCAN_API_KEY;
}

let alchemyToken: string;
if (!process.env.ALCHEMY_TOKEN) {
  throw new Error("Please set your ALCHEMY_TOKEN in a .env file");
} else {
  alchemyToken = process.env.ALCHEMY_TOKEN;
}

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url = `https://sandbox.truffleteams.com/0a8d1f80-44ed-49e0-972b-09709b4fe2b3`;
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: chainIds.ganache,
      forking: { url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyToken}`, blockNumber: 12062034 },
    },
    forked: createTestnetConfig("ganache"),
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.0",
    settings: {
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha: { timeout: 3000000 },
};

export default config;
