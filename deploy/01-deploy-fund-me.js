// import
// main function

// function deployFunc() {
//     console.log("Hi1")
//     hre.getNamedAccounts
//     hre.deployments
// }

// module.exports.default = deployFunc

const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
// const helperConfig = require("../helper-hardhat-config");
// const networkConfig = helperConfig.networkConfig;
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    // const { getNamedAccounts, deployments } = hre
    // hre.getNamedAccounts
    // hre.deployments
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    console.log(`deployer is: ${deployer}`);

    // Obtain Price Feed Address
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsePriceFeed"];
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    // if the contract doesn't exist, we deploy a minimal version of mock for our local testing
    // when going to localhost network, we want to use a mock
    const args = [ethUsdPriceFeedAddress];

    console.log(`ethUsdPriceFeedAddress is: ${ethUsdPriceFeedAddress}`);
    console.log(`args is: ${args}`);

    log("----------------------------------------------------");
    log("Deploying FundMe and waiting for confirmations...");

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        // waitConfirmations: network.config.blockConfirmations,
    });
    log(`FundMe deployed at ${fundMe.address}`);

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }

    log("======================================");
};

module.exports.tags = ["all", "fundme"];
