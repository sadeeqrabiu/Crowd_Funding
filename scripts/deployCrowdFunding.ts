import { Address, toNano } from '@ton/core';
import { CrowdfundingContract } from '../wrappers/CrowdFunding';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const owner = Address.parse("0QA8fR_EYMp12C9VDDUamQCyzqAd6aCA5xuSqQ4d8phTKP_M"); // Replace with owner address
    const fundingGoal = toNano("100"); // 100 TON as funding goal
    const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

    const crowdfundingContract = provider.open(
        CrowdfundingContract.createFromConfig(
            {
                owner,
                fundingGoal,
                deadline,
            },
            await compile("CrowdfundingContract")
        )
    );

    await crowdfundingContract.sendDeploy(provider.sender(), toNano("0.05"));
    console.log("Crowdfunding contract deployed!");
    // const crowdFunding = provider.open(await CrowdFunding.fromInit());

    // await crowdFunding.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: 'Deploy',
    //         queryId: 0n,
    //     }
    // );

    // await provider.waitForDeploy(crowdFunding.address);

    // // run methods on `crowdFunding`
}
