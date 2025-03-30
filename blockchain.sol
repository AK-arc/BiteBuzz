// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FoodVerification {
    struct FoodItem {
        string name;
        string origin;
        bool isVerified;
    }

    mapping(uint256 => FoodItem) public foodItems;
    uint256 public foodCounter;

    address public owner;

    constructor() {
        owner = msg.sender; // Set contract deployer as owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can verify food");
        _;
    }

    function addFood(string memory _name, string memory _origin) public {
        foodItems[++foodCounter] = FoodItem(_name, _origin, false);
    }

    function verifyFood(uint256 _id) public onlyOwner {
        require(_id > 0 && _id <= foodCounter, "Invalid ID");
        foodItems[_id].isVerified = true;
    }

    function getFood(uint256 _id) public view returns (string memory, string memory, bool) {
        require(_id > 0 && _id <= foodCounter, "Invalid ID");
        return (foodItems[_id].name, foodItems[_id].origin, foodItems[_id].isVerified);
    }
}

