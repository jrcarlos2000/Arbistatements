import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@semaphore-protocol/hardhat"
import "@typechain/hardhat"
import { config as dotenvConfig } from "dotenv"
import "hardhat-gas-reporter"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import "solidity-coverage"
import { config } from "./package.json"
import "./tasks/deploy"
import "./tasks/deploy-goerli"
dotenvConfig({ path: resolve(__dirname, "../../.env") });
let accounts:any;
if (process.env.ETHEREUM_PRIVATE_KEY) {
    accounts = [`0x${process.env.ETHEREUM_PRIVATE_KEY}`]
}
// function getNetworks(): NetworksUserConfig {


//         return {
//             goerli: {
//                 url: `https://goerli.infura.io/v3/${infuraApiKey}`,
//                 chainId: 5,
//                 accounts
//             },
//             arbitrum: {
//                 url: "https://arb1.arbitrum.io/rpc",
//                 chainId: 42161,
//                 accounts
//             },
            
//         }
//     }

//     return {}
// }

const hardhatConfig: HardhatUserConfig = {
    solidity: config.solidity,
    paths: {
        sources: config.paths.contracts,
        tests: config.paths.tests,
        cache: config.paths.cache,
        artifacts: config.paths.build.contracts
    },
    networks: {
        polygonMumbai : {
            url  : "https://polygontestapi.terminet.io/rpc",
            chainId : 80001,
            accounts
        },
        optimism : {
            url : "https://goerli.optimism.io/",
            chainId : 420,
            accounts
        },
        hardhat: {
            chainId: 1337
        },
        localhost : {
            url : "http://127.0.0.1:8545/",
            chainId : 1337
        },
        goerli : {
            url : "https://eth-goerli.g.alchemy.com/v2/hWfQJAPySBhyWgNWQfuctPoP3nkqAL45",
            chainId : 5,
            accounts
        },
        boba : {
            url : "https://replica.bobabase.boba.network",
            chainId : 1297,
            accounts
        },
        
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        outDir: config.paths.build.typechain,
        target: "ethers-v5"
    }
}

export default hardhatConfig
