// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    uint public numOfFunders;

    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    modifier limitWithdraw(uint amount) {
        require(
            amount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );

        _;
    }

    receive() external payable {}

    function emitLog() public override pure returns(bytes32) {
        return "Hello world";
    }

    function addFunds() external payable {
        address funder = msg.sender;

        if (!funders[funder]) {
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        } 
    }

    function adminProtectedFunction() external ownerGuard {
        // some managing stuff that only admin should have access to
    }


    function adminProtectedFunction2() external ownerGuard {
        // some managing stuff that only admin should have access to
    }

    function withdraw(uint amount) external limitWithdraw(amount) {
        payable(msg.sender).transfer(amount);
    }

    function getFunders () external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns(address) {
        return lutFunders[index];
    }

}


// const i = await Faucet.deployed()

// i.addFunds({ value: "2000000000000000000", from: accounts[0] })
// i.addFunds({ value: "2000000000000000000", from: accounts[1] })

// i.adminProtectedFunction({ from: accounts[0] })

// i.withdraw("100000000000000001", { from: accounts[0] })

// i.getFunderAtIndex(0)
// i.getFunders()
