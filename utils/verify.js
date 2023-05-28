const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
    console.log("Verifying Contract...");
    console.log(`contractAddress is ${contractAddress}`);
    console.log(`args is: ${args}`);
    try {
        await run("verify:verify", {
            address: contractAddress,
            constuctorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already been verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
};

module.exports = { verify };
