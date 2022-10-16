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
dotenvConfig({ path: resolve(__dirname, "../../.env") });
let accounts:any;
if (process.env.ETHEREUM_PRIVATE_KEY) {
    accounts = [`0x${process.env.ETHEREUM_PRIVATE_KEY}`,`0x${process.env.RELAYER_PRIVATE_KEY}`]
}

const hardhatConfig: HardhatUserConfig = {
    solidity: config.solidity,
    paths: {
        sources: config.paths.contracts,
        tests: config.paths.tests,
        cache: config.paths.cache,
        artifacts: config.paths.build.contracts
    },
    networks: {
        arbitrum : {
            url : "https://quaint-greatest-gadget.arbitrum-goerli.discover.quiknode.pro/b060186bff692501beab140a5da0116cbb9694af/",
            chainId : 421613,
            accounts
        },
        hardhat: {
            chainId: 1337
        },
        localhost : {
            url : "http://127.0.0.1:8545/",
            chainId : 1337
        }
        
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
