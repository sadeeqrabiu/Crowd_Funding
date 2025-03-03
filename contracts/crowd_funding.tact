import "@stdlib/deploy";


// Crowdfunding Contract
contract CrowdFunding with Deployable {
   // State variables
    owner: Address;
    fundingGoal: Int;
    deadline: Int;
    totalFundsRaised: Int;
    contributions: map<Address, Int>;

    // Constructor
    init(owner: Address, fundingGoal: Int, deadline: Int) {
        require(fundingGoal > 0, "Funding goal must be greater than 0");
        require(deadline > now(), "Deadline must be in the future");

        self.owner = owner;
        self.fundingGoal = fundingGoal;
        self.deadline = deadline;
        self.totalFundsRaised = 0;
        self.contributions = emptyMap();
    }

    // Contribute function
    receive("contribute") {
        require(now() < self.deadline, "Campaign has ended");
        require(context().value > 0, "Contribution must be greater than 0");

        // Record contribution
        self.contributions.set(sender(), context().value);
        self.totalFundsRaised += context().value;
    }

    // Complete campaign function (only owner)
    fun completeCampaign() {
        require(sender() == self.owner, "Only the owner can call this function");
        require(now() >= self.deadline, "Campaign is still ongoing");

        if (self.totalFundsRaised >= self.fundingGoal) {
            // Transfer funds to owner
            send(SendParameters{
                to: self.owner,
                value: self.totalFundsRaised,
                mode: SendIgnoreErrors
            });
        } else {
            // Refund all contributors
            let contributors: map<Address, Int> = self.contributions;
            foreach(key, value in contributors) {
                send(SendParameters{
                    to: key,
                    value: value,
                    mode: SendIgnoreErrors
                });
            }
        }
    }

    // Getter method for total funds raised
    get fun totalFundsRaised(): Int {
        return self.totalFundsRaised;
    }
}
