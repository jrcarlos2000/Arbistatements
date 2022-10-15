import { task, types } from "hardhat/config"
import {ethers} from "hardhat"

task("deploy-goerli", "Deploy a Greeter contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addParam("group", "Group identifier", 42, types.int)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {

        // const accounts = await ethers.provider.listAccounts();
        // console.log(accounts);
        // if (!semaphoreAddress) {
            // const { address: verifierAddress } = await run("deploy:verifier", { logs, merkleTreeDepth: 20 })

            // const { address } = await run("deploy:semaphore", {
            //     logs,
            //     verifiers: [
            //         {
            //             merkleTreeDepth: 20,
            //             contractAddress: verifierAddress
            //         }
            //     ]
            // })

            // semaphoreAddress = address
        // }

        console.log("debug");

        let semaphore = "0xE585f0Db9aB24dC912404DFfb9b28fb8BF211fA6";

        const chainStatement = await ethers.getContractFactory("ChainStatement")
        const DummyToken = await ethers.getContractFactory("DummyToken")
        const BalanceGiver = await ethers.getContractFactory("BalanceGiver")

        const chainStatementc = await chainStatement.deploy(semaphore,"0xDe3089d40F3491De794fBb1ECA109fAc36F889d0", 42,{gasLimit : 1000000})
        await chainStatementc.deployed()
        // const cUSDT = await DummyToken.deploy("USDT","USDT");
        // await cUSDT.deployed()
        // const cUSDC = await DummyToken.deploy("USDC","USDC");
        // await cUSDC.deployed()
        // const cDAI = await DummyToken.deploy("DAI","DAI");
        // await cDAI.deployed()
        // const cBTC = await DummyToken.deploy("BTC","BTC");
        // await cBTC.deployed()
        // const cETH = await DummyToken.deploy("ETH","ETH");
        // await cETH.deployed()

        // const cBalanceGiver =  await BalanceGiver.deploy([cUSDT.address, cUSDC.address, cDAI.address, cBTC.address, cETH.address]);


        // if (logs) {
        //     console.info(`ChainStatment contract has been deployed to: ${chainStatementc.address}`)
        // }

        // accounts = await ethers.provider.listAccounts();
        // const signer = ethers.provider.getSigner(accounts[0]);
        // let tx = {
        //          to: "0x4bdB8234AD81F26985d257F36a2d2d8c30365546",
        //         value: ethers.utils.parseEther('2')
        //     };
        // const transaction = await signer.sendTransaction(tx);

        return chainStatement
    })
