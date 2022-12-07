const networkConfig= {
    5:{
        name:"goerli",
        ethUsdPriceFeed:"0x44E696B660C52fcA1A714F893EA6E7C15a6E7886"
    },
    137:{
        name:"polygon",
        ethUsdPriceFeed:"0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
}

const developmentChain=["hardhat","localhost","ganache"];
const DECIMALS=8;
const INITIAL_ANSWER=200000000000;

module.exports={
    networkConfig,
    developmentChain,
    DECIMALS,
    INITIAL_ANSWER,
};