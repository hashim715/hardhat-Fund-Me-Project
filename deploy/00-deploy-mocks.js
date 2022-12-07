const {network}=require("hardhat");
const {developmentChain,DECIMALS,INITIAL_ANSWER}=require("../helper-hardhat-config");

module.exports=async (hre)=>{
    const {getNamedAccounts,deployments}=hre;
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();
    if(developmentChain.includes(network.name)){
        log("Local network detected Deploying mocks");
        await deploy("MockV3Aggregator",{
            contract:"MockV3Aggregator",
            from:deployer,
            log:true,
            args:[DECIMALS,INITIAL_ANSWER] //passing required arguments to contrcutor of mock contrat
        });
        log("Mocks deployed");
        log("-----------------------------------------------"); 
    }
}

module.exports.tags=[
    "all","mocks"
];