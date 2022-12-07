const {getNamedAccounts,ethers,network}=require("hardhat");
const {developmentChain}=require("../../helper-hardhat-config");
const {assert}=require("chai");

developmentChain.includes(network.name) 
? describe.skip
: describe("FundMe",async ()=>{
    let fundMe;
    let deployer;
    const sendValue=ethers.utils.parseEther("0.15");
    console.log(sendValue);
    beforeEach(async ()=>{
        deployer=(await getNamedAccounts()).deployer;
        fundMe=await ethers.getContract("FundMe",deployer);
    });
    it("allows people to fund and withdraw",async function(){
        const fundTxResponse = await fundMe.fund({ value: sendValue,gasLimit: 2000000});
        await fundTxResponse.wait(6);
        const nouce = txResponse.nonce;
        const withdrawTxResponse = await fundMe.withdraw({ nonce : nouce + 1, gasLimit: 2000000});
        await withdrawTxResponse.wait(12);
        const endingBalance=await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(),"0");
    });
});