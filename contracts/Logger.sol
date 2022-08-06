// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// I'ts a way for designer to say that
// "any child of the abstract contract
// has to implement specified methods"

abstract contract Logger {
    function emitLog() public pure virtual returns(bytes32);

    function test3() external pure returns (uint) {
        return 100;
    }
}


// const i = await Faucet.deployed()

// i.addFunds({ value: "2000000000000000000", from: accounts[0] })
// i.addFunds({ value: "2000000000000000000", from: accounts[1] })

// i.adminProtectedFunction({ from: accounts[0] })

// i.withdraw("100000000000000001", { from: accounts[0] })

// i.getFunderAtIndex(0)
// i.getFunders()
