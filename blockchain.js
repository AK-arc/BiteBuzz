const Web3 = require('web3');
const contractABI = [ /* Your Contract ABI Here */ ];
const contractAddress = "0xYourSmartContractAddress";

// Connect to Ethereum Network (Infura or Alchemy)
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

// Load Contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Private Key (⚠️ NEVER expose private keys in public code!)
const privateKey = "0xYourPrivateKey";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Function to Verify Food Item
async function verifyFood(id) {
    try {
        // Build transaction
        const tx = contract.methods.verifyFood(id);
        const gas = await tx.estimateGas({ from: account.address });
        const gasPrice = await web3.eth.getGasPrice();

        const txData = {
            from: account.address,
            to: contractAddress,
            gas,
            gasPrice,
            data: tx.encodeABI(),
        };

        // Sign and Send Transaction
        const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("✅ Transaction Successful! Hash:", receipt.transactionHash);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

// Call the function to verify a food item (Example: ID = 1)
verifyFood(1);
