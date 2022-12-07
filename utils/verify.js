const {run}=require("hardhat");
const verify=async (contractaddress,args)=>{
    console.log("Verifying contract....");
    try {
      await run("verify:verify",{
        address:contractaddress,
        constructorArguments:args,
      });
    }
    catch(e){
      if(e.message.toLowerCase().includes("already verified")){
        console.log("already verified");
      }
      else {
        console.log(e);
      }
    }
}
module.exports={verify};