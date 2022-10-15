import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String,getAddress } from "ethers/lib/utils"
import { ethers, run } from "hardhat"
import { Greeter,Arbistatements } from "../build/typechain"
import { config } from "../package.json"

describe("Arbistatements", () => {
    let chainStatement : Arbistatements
    const users: any = []
    const groupId = 42;
    let relayer:any;
    const testAddresses = ["0xaE481806AC0aCD80032F7650040744709F19A266","0xF3eFACE0E659e9F67978D4c72067E5842Bac492B"]

    before(async () => {
        chainStatement = await run("deploy", { logs: false, group: groupId })
        const accounts = await ethers.provider.listAccounts();
        relayer = ethers.provider.getSigner(accounts[1]);
        users.push({
            identity: new Identity("carloscarloscarlos"),
            address: testAddresses[0]
        })

        users.push({
            identity: new Identity("carloscarloscarlos"),
            address: testAddresses[1]
        })

    })

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            for (let i = 0; i < 1; i += 1) {
                let tmpIdentity = new Identity("carloscarloscarlos");
                const transaction = await chainStatement.connect(relayer).addNewUser(tmpIdentity.generateCommitment(), users[i].address)
                await transaction.wait();
            }
            // await chainStatement.addNewUser(users[0].identity.generateCommitment(), users[0].address[1])
        })
    })

    describe("get bank statement",()=>{
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`
             

        it("should manage to get bank statement", async () => {

            let group2 = new Group();
            let tmpIdentity : any = new Identity("carloscarloscarlos");
            group2.addMember(tmpIdentity.generateCommitment());
            const mess = formatBytes32String("hola")
            const fullProof = await generateProof(tmpIdentity, group2, BigInt(42), mess, {
                wasmFilePath,
                zkeyFilePath
            })

            const solidityProof = packToSolidityProof(fullProof.proof)
            console.log(tmpIdentity.generateCommitment(),mess);
            const transaction = await chainStatement.claimStatement(
                tmpIdentity.generateCommitment(),
                mess,
                fullProof.publicSignals.merkleRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )
            await transaction.wait();
        })
    })

    describe("get address based on identity Commitment",()=>{
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
