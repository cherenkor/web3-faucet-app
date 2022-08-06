// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier ownerGuard {
        require(
            msg.sender == owner,
            "Only owner can call this function"
        );

        _;
    }
}


// const i = await Faucet.deployed()

// i.addFunds({ value: "2000000000000000000", from: accounts[0] })
// i.addFunds({ value: "2000000000000000000", from: accounts[1] })

// i.adminProtectedFunction({ from: accounts[0] })

// i.withdraw("100000000000000001", { from: accounts[0] })

// i.getFunderAtIndex(0)
// i.getFunders()
