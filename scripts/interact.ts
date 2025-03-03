import { Address, toNano } from "@ton/core";
import { CrowdfundingContract } from "../wrappers/CrowdFunding";
import { NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
    const contractAddress = Address.parse("CONTRACT_ADDRESS"); // Replace with contract address
    const crowdfundingContract = provider.open(CrowdfundingContract.createFromAddress(contractAddress));

    // Contribute to the campaign
    await crowdfundingContract.sendContribute(provider.sender(), toNano("10")); // Contribute 10 TON
    console.log("Contribution sent!");

    // Complete the campaign (only owner)
    await crowdfundingContract.sendCompleteCampaign(provider.sender());
    console.log("Campaign completed!");
}