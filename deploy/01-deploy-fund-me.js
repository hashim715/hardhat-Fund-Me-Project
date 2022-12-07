//traditional way of deploying contract in hardhat

//import 
//main
//calling of main function

//one way to deploy using hardhat-deploy module
// const deployFunc=(hre)=>{
//     console.log(hre);
//     console.log("hello world blockchain");
// }
// module.exports=deployFunc;

//other way to deploy contract using hardhat-deploy module

const {networkConfig,developmentChain}=require("../helper-hardhat-config");
const {network}=require("hardhat");
const {verify}=require("../utils/verify");

module.exports=async (hre)=>{
    const {getNamedAccounts,deployments}=hre;
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();
    const chaidId=network.config.chainId;
    //when going for localhost or hardhat network we want to use a mock

    let ethUsdPriceFeedAddress;
    if(developmentChain.includes(network.name)){
        const ethUsdAggregator=await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress=ethUsdAggregator.address;
    }
    else {
        ethUsdPriceFeedAddress=networkConfig[chaidId]["ethUsdPriceFeed"];
    }
    //if the contract does not exist, we deploy a minimal version of it for our 
    //local testnet

    const args=[ethUsdPriceFeedAddress];

    const fundme=await deploy("FundMe",{
        from:deployer,
        args:args, //put priceFeed address here
        log:true,
        waitConfirmations:network.config.blockConfirmations || 1
    });
    if(!developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        //verify
        await verify(fundme.address,args);
    }
    log("Contract Deployed");
    log("----------------------------------------------");
}

module.exports.tags=["all","FundMe"];