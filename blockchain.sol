// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FoodVerification {
    struct FoodItem {
        string name;
        string origin;
        bool isVerified;
    }
    
    mapping(uint256 => FoodItem) public foodItems;
    uint256 public foodCounter = 0;

    function addFood(string memory _name, string memory _origin) public {
        foodCounter++;
        foodItems[foodCounter] = FoodItem(_name, _origin, false);
    }

    function verifyFood(uint256 _id) public {
        require(_id > 0 && _id <= foodCounter, "Invalid ID");
        foodItems[_id].isVerified = true;
    }

    function getFood(uint256 _id) public view returns (string memory, string memory, bool) {
        return (foodItems[_id].name, foodItems[_id].origin, foodItems[_id].isVerified);
    }
}






const Web3 = require('web3');
const contractABI = /* Add compiled ABI */;
const contractAddress = "0xYourSmartContractAddress";

const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function verifyFood(id) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.verifyFood(id).send({ from: accounts[0] });
}

verifyFood(1);
