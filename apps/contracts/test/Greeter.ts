import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String,getAddress } from "ethers/lib/utils"
import { ethers, run } from "hardhat"
import { Greeter,ChainStatement } from "../build/typechain"
import { config } from "../package.json"

describe("Greeter", () => {
    let chainStatement : ChainStatement
    // let greeter: Greeter
    // let signer;
    const users: any = []
    const groupId = 42;
    let signer:any;
    const group = new Group()
    const group2 = new Group()
    const myAddress = "0xaE481806AC0aCD80032F7650040744709F19A266"
    const yourAddress = "0xF3eFACE0E659e9F67978D4c72067E5842Bac492B"

    before(async () => {
        chainStatement = await run("deploy", { logs: false, group: groupId })
        const accounts = await ethers.provider.listAccounts();
        console.log(accounts[0]);
        signer = ethers.provider.getSigner(accounts[0]);
        users.push({
            identity: new Identity("holaholahola"),
            // account 19
            address: [myAddress]
        })

        users.push({
            identity: new Identity("dil+2810+password2"),
            // account 18
            address: [yourAddress]
        })

    })

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            for (let i = 0; i < 2; i += 1) {
                // console.log(i)
                const transaction = await chainStatement.connect(signer).addNewUser(users[i].identity.generateCommitment(), users[i].address[0])
                await transaction.wait();
                // await expect(transaction).to.emit(greeter, "NewUser").withArgs(group.members[i], users[i].username)
            }
            // await chainStatement.addNewUser(users[0].identity.generateCommitment(), users[0].address[1])
        })
    })

    describe("get bank statement",()=>{
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`
             

        it("should manage to get bank statement", async () => {

            group.addMember(users[0].identity.generateCommitment())
            group.addMember(users[1].identity.generateCommitment())

            const greeting = formatBytes32String("Joined the protocol")
            const greeting2 = formatBytes32String("Joined theas protocol")

            const fullProof = await generateProof(users[0].identity, group, BigInt(groupId), greeting, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = await chainStatement.claimStatement(
                users[0].identity.generateCommitment(),
                greeting,
                fullProof.publicSignals.merkleRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )
            
            await transaction.wait();
            // console.log("success");
        })
    })

    describe("get address basedd on identity Commitment",()=>{
        it("get address successfull",async()=>{
            for (let i = 0; i<1;i+=1){
                const addr = await chainStatement.getAddresses(users[i].identity.generateCommitment())
                // console.log("Addr = ",addr)
            }
            
        })
        it("get address should fail if time passed",async()=>{

            let try1 = await chainStatement.getTimeStamp(users[0].identity.generateCommitment());
            console.log(try1.toString());
            await ethers.provider.send("evm_increaseTime", [10000]);
            try1 = await chainStatement.getTimeStamp(users[0].identity.generateCommitment());
            console.log(try1.toString());
            const accounts = await ethers.provider.listAccounts();
            
            const signer = ethers.provider.getSigner(accounts[1]);
            await expect(chainStatement.connect(signer).getAddresses(users[0].identity.generateCommitment()));
            
        })

    })
})
    // describe("# greet", () => {
    //     const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    //     const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    //     it("Should allow users to greet", async () => {
    //         const greeting = formatBytes32String("Hello World")

    //         const fullProof = await generateProof(users[1].identity, group, BigInt(groupId), greeting, {
    //             wasmFilePath,
    //             zkeyFilePath
    //         })
    //         const solidityProof = packToSolidityProof(fullProof.proof)

    //         const transaction = greeter.greet(
    //             greeting,
    //             fullProof.publicSignals.merkleRoot,
    //             fullProof.publicSignals.nullifierHash,
    //             solidityProof
    //         )

    //         await expect(transaction).to.emit(greeter, "NewGreeting").withArgs(greeting)
    //     })
    // })