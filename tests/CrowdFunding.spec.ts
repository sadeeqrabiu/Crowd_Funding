import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CrowdfundingContract } from '../wrappers/CrowdFunding';
import '@ton/test-utils';
import { compile, NetworkProvider } from '@ton/blueprint';

describe('CrowdFunding', () => {
    let blockchain: Blockchain;
    // let provider: NetworkProvider;
    let crowdfunding: SandboxContract<CrowdfundingContract>;
    let owner: SandboxContract<TreasuryContract>;
    let contributor: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        // provider = blockchain.provider;
        owner = await blockchain.treasury("owner");
        contributor = await blockchain.treasury("contributor");

        crowdfunding = blockchain.openContract(
            CrowdfundingContract.createFromConfig(
                {
                    owner: owner.address,
                    fundingGoal: toNano("100"),
                    deadline: Math.floor(Date.now() / 1000) + 86400, // 1 day from now
                },
                await compile("CrowdFunding")
            )
        );

        await crowdfunding.sendDeploy(owner.getSender(), toNano("0.05"));
    });

    it("should accept contributions", async () => {
        await crowdfunding.sendContribute(contributor.getSender(), toNano("10"));
        const totalFundsRaised = await crowdfunding.getTotalFundsRaised();
        expect(totalFundsRaised).toEqual(toNano("10"));
    });

    it("should complete campaign and transfer funds to owner", async () => {
        await crowdfunding.sendContribute(contributor.getSender(), toNano("100"));
        await crowdfunding.sendCompleteCampaign(owner.getSender());

        const ownerBalance = await owner.getBalance();
        expect(ownerBalance).toBeGreaterThan(toNano("100"));
    });
});
