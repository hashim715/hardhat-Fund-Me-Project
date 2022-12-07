require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");
require('hardhat-deploy');

const GOERLI_RPC_URL=process.env.GOERLI_RPC_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY;
const COINMARKET=process.env.COINMARKET_API_KEY;
const PRIVATE_KEY_1=process.env.PRIVATE_KEY_1;
const GANACHE_PRIVATE_KEY=process.env.GANACHE_PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //solidity: "0.8.17",
  solidity:{
    compilers:[
      {version:"0.8.8"},
      {version:"0.6.6"}
    ],
  },
  networks:{
    goerli:{
      url:GOERLI_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:5,
      blockConfirmations:6,
    },
    ganache:{
      url:"http://127.0.0.1:7545/",
      accounts:[GANACHE_PRIVATE_KEY],
      chainId:1337
    },
    localhost:{
      url:"http://127.0.0.1:8545/",
      //accounts:not required!,
      chainId:31337
    }
  },
  defaultNetwork:"hardhat",
  etherscan:{
    apiKey:ETHERSCAN_API_KEY
  },
  gasReporter:{
    enabled:true,
    currency:"USD",
    //outputFile:"gas-report.txt",
    coinmarketcap:COINMARKET,
    token:"ETH",
    //noColors:true,
  },
  namedAccounts:{
    deployer:{
      default:0
    },
    user:{
      default:1
    }
  },
  mocha: {
    timeout: 500000,
  }
};
