// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Contract for storing and retrieving a value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Storage {

    uint256 private number;

    /**
     * @dev Stores a given value in the 'number' variable
     * @param num The value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Retrieves the value stored in the 'number' variable
     * @return The value of 'number'
     */
    function retrieve() public view returns (uint256) {
        return number;
    }
}
