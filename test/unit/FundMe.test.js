const {deployments,ethers,getNamedAccounts,network}=require("hardhat");
const {developmentChain}=require("../../helper-hardhat-config");
const {assert,expect}=require("chai");
!developmentChain.includes(network.name) 
? describe.skip
: describe("FundMe",async ()=>{
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue=ethers.utils.parseEther("1") //1 ETH
    beforeEach(async ()=>{
        //deploy our fundMe contract
        // using Hardhat-deploy
        // const accounts=await ethers.getSigners();
        // const account1=accounts[0];
        deployer=(await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe=await ethers.getContract("FundMe",deployer);
        mockV3Aggregator=await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    });
    describe("constructor",async ()=>{
        it("sets the aggregator address correctly",async ()=>{
            const response=await fundMe.getPriceFeed();
            console.log(`getPriceFeed Address ${response}`);
            assert.equal(response,mockV3Aggregator.address);
        });
    });
    describe("fund",async()=>{
        it("Fails if you don't send enough ETH",async ()=>{
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        });
        it("updated the amount funded data structure",async ()=>{
            await fundMe.fund({value:sendValue});
            const response=await fundMe.getAddressToAmountFunded(
                deployer
            );
            assert.equal(response.toString(),sendValue.toString());
        });
        it("Adds funder to array of getFunder",async ()=>{
            await fundMe.fund({value:sendValue});
            const funder=await fundMe.getFunder(0);
            assert.equal(funder,deployer);
        });
    });
    describe("withdraw",async ()=>{
        beforeEach(async ()=>{
            await fundMe.fund({value:sendValue});
        });
        it("withdraw ETH from a single funder",async ()=>{
            //Arrange
            const startingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );
            //Act
            const transactionResponse=await fundMe.withdraw();
            const transactionReceipt=await transactionResponse.wait(1);
            const {gasUsed,effectiveGasPrice}=transactionReceipt;
            const gasCost=gasUsed.mul(effectiveGasPrice);

            const endingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );
            //Assert
            assert.equal(endingFundMeBalance,0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());
        });
        it("allow us to withdraw with multiple getFunder",async ()=>{
            const accounts=await ethers.getSigners();
            for(let i=1;i<6;i++){
                const fundMeConnectedContract=await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({value:sendValue});
            }
            const startingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );

            //Act
            const transactionResponse=await fundMe.withdraw();
            const transactionReceipt=await transactionResponse.wait(1);
            const {gasUsed,effectiveGasPrice}=transactionReceipt;
            const gasCost=gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );
            //Assert
            assert.equal(endingFundMeBalance,0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());

            //Make sure that the getFunder are reset properly

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for(let i=1;i<6;i++){
                assert.equal(
                    await fundMe.getAddressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
        });
        it("Only allows the owner to withdraw",async ()=>{
            //this is going to be another one there.
            const accounts=await ethers.getSigners();
            const attacker=accounts[1];
            console.log(`Attacker address ${attacker.address}`);
            const attackerConnectedContract=await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        });
        it("cheaperWithdraw testing...",async ()=>{
            const accounts=await ethers.getSigners();
            for(let i=1;i<6;i++){
                const fundMeConnectedContract=await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({value:sendValue});
            }
            const startingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );

            //Act
            const transactionResponse=await fundMe.cheaperwithdraw();
            const transactionReceipt=await transactionResponse.wait(1);
            const {gasUsed,effectiveGasPrice}=transactionReceipt;
            const gasCost=gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );
            //Assert
            assert.equal(endingFundMeBalance,0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());

            //Make sure that the getFunder are reset properly

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for(let i=1;i<6;i++){
                assert.equal(
                    await fundMe.getAddressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
        });
        it("cheaper withdraw ETH from a single funder",async ()=>{
            //Arrange
            const startingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );
            //Act
            const transactionResponse=await fundMe.cheaperwithdraw();
            const transactionReceipt=await transactionResponse.wait(1);
            const {gasUsed,effectiveGasPrice}=transactionReceipt;
            const gasCost=gasUsed.mul(effectiveGasPrice);

            const endingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            );
            //Assert
            assert.equal(endingFundMeBalance,0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());
        });
    });
});

//so that's all about testing that we have done it today on hardhat 
// testing the contract in hardhat means testing whether the functions in contract
//written in solidity works properly or not hardhat testing is very powerfull when you 
// want to test whether the function works properly according to your instructions 
//you test it after deploying the contract and then you run functions in the contract
// then you pass arguments to that functions which are required in it and then you 
// can test according to the conditions that you have mentioned in solidity in order
// to check whether they work properly or not
// we will continue with another powerfull debuggin tool in solidity and hardat 
// that is console.log