// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// they cannot inherit from other SC
// the can only inherit fro other interfaces

// They cannot declare a constructor
// The cannot declare state variables
// All declared functions have to be external

interface IFaucet {
    function addFunds() external payable;
    function withdraw(uint amount) external;

}
