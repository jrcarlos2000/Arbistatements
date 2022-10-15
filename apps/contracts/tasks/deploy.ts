import { task, types } from "hardhat/config"
import {ethers} from "hardhat"
import { config as dotenvConfig } from "dotenv"

task("deploy", "Deploy a Greeter contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addParam("group", "Group identifier", 42, types.int)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {

        if (!semaphoreAddress) {
            const { address: verifierAddress } = await run("deploy:verifier", { logs, merkleTreeDepth: 20 })

            const { address } = await run("deploy:semaphore", {
                logs,
                verifiers: [
                    {
                        merkleTreeDepth: 20,
                        contractAddress: verifierAddress
                    }
                ]
            })

            semaphoreAddress = address
        }

        const cfArbistatements = await ethers.getContractFactory("Arbistatements")
        const DummyToken = await ethers.getContractFactory("DummyToken")
        const BalanceGiver = await ethers.getContractFactory("BalanceGiver")

        const accounts = await ethers.provider.listAccounts();
        const Arbistatements : any = await cfArbistatements.deploy(semaphoreAddress,process.env.RELAYER_ADDRESS!, groupId)
        // const Arbistatements : any = await cfArbistatements.deploy(semaphoreAddress,accounts[1], groupId)
        await Arbistatements.deployed()

        if(ethers.provider.network.chainId == 1337){
            console.log("localhost dev")
            const accounts_to_fund:any = process.env.ACCOUNTS_TO_FUND?.split(",");
            const signer = await ethers.getSigner(accounts[0]);
            for(let i = 0; i<accounts_to_fund!.length ; i++){
                const transactionHash = await signer.sendTransaction({
                    to: accounts_to_fund[i],
                    value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
                });
                await transactionHash.wait();
            }
        }
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


        if (logs) {
            console.info(`Arbistatements contract has been deployed to: ${Arbistatements.address}`)
        }

        // accounts = await ethers.provider.listAccounts();
        // const signer = ethers.provider.getSigner(accounts[0]);
        // let tx = {
        //          to: "0x4bdB8234AD81F26985d257F36a2d2d8c30365546",
        //         value: ethers.utils.parseEther('2')
        //     };
        // const transaction = await signer.sendTransaction(tx);

        return Arbistatements
    })
