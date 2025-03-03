export * from '../build/CrowdFunding/tact_CrowdFunding';
import { Address, Cell, ContractProvider, Sender, beginCell, toNano } from "@ton/core";

export class CrowdfundingContract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromConfig(config: { owner: Address; fundingGoal: bigint; deadline: number }, code: Cell) {
        const data = beginCell()
            .storeAddress(config.owner)
            .storeCoins(config.fundingGoal)
            .storeUint(config.deadline, 64)
            .endCell();
        return new CrowdfundingContract(Address.parse("CONTRACT_ADDRESS"), { code, data });
    }

    static createFromAddress(address: Address): CrowdfundingContract {
        return new CrowdfundingContract(address);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, { value });
    }

    async sendContribute(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, { value, body: beginCell().storeUint(0, 32).endCell() });
    }

    async sendCompleteCampaign(provider: ContractProvider, via: Sender) {
        await provider.internal(via, { value: toNano("0.01"), body: beginCell().storeUint(1, 32).endCell() });
    }

    // async getTotalFundsRaised(provider: ContractProvider): Promise<bigint> {
    //     const result = await provider.get(this.address.toString(), { method: 'getTotalFundsRaised' });
    //     return result.stack.readBigNumber();
    // }

    async getTotalFundsRaised(provider: ContractProvider): Promise<bigint> {
        // Call the getter method "totalFundsRaised" with no arguments
        const result = await provider.get("totalFundsRaised", []);

        // Read the result from the stack
        const stack = result.stack;
        return stack.readBigNumber();
    }
}