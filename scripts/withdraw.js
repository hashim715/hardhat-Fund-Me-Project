const {getNamedAccounts,ethers}=require("hardhat");
const main=async ()=>{
    const {deployer}=await getNamedAccounts();
    const fundMe=await ethers.getContract('FundMe',deployer);
    console.log("Funding...");
    const transactionFundResponse=await fundMe.fund({value:ethers.utils.parseEther("1")});
    transactionFundResponse.wait(1);
    console.log("Funded...");
    const transactionResponse=await fundMe.withdraw();
    await transactionResponse.wait(1);
    console.log("Got it back!");
    console.log(transactionResponse);
}

main().then(()=>{
    process.exit(0);
}).catch((error)=>{
    console.log(error);
    process.exit(1);
});