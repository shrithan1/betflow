// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Owner.sol";


contract Disableable is Ownable {
    bool disabled = false; 

    modifier notDisabled() {
        require(!disabled);
        _;
    }

    function Disable() external onlyOwner {
        disabled = true; 
    }

    function Enable() external onlyOwner {
        disabled = false; 
    }
}