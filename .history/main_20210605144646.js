// const SHA256 = require("crypto-js/sha256");

// class Block {
//   constructor(index, timestamp, data, previousHash = '') {
//     this.index = index;
//     this.previousHash = previousHash;
//     this.timestamp = timestamp;
//     this.data = data;
//     this.hash = this.calculateHash();
//     this.nonce = 0;
//   }

//   calculateHash() {
//       return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
//   }
//   //adding the difficulty amount of zeros for difficulty
//   mineBlock(difficulty) {
//       while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
//           this.nonce++;
//           this.hash = this.calculateHash();
//         }
//         console.log("BLOCK MINED: " + this.hash);
//     }
// }


// class Blockchain{
//     constructor() {
//         this.chain = [this.createGenesisBlock()];
//         this.difficulty = 5;
//     }

//     createGenesisBlock() {
//         return new Block(0, "01/01/2017", "Genesis block", "0");
//     }

//     getLatestBlock() {
//         return this.chain[this.chain.length - 1];
//     }

//     addBlock(newBlock) {
//         newBlock.previousHash = this.getLatestBlock().hash;
//         newBlock.mineBlock(this.difficulty);
//         this.chain.push(newBlock);
//     }

//     // VALIDITY OF THE BLOCKCHAIN

    
//     isChainValid() {
//         // checking from the block next to genesis block
//         for (let i = 1; i < this.chain.length; i++){
//             const currentBlock = this.chain[i];
//             const previousBlock = this.chain[i - 1];

//         //checking linking if the (hash of the block is validv yet)

//             if (currentBlock.hash !== currentBlock.calculateHash()) {
//                 return false;
//             }
//         //if our block points to corretct previsous hash
    
//             if (currentBlock.previousHash !== previousBlock.hash) {
//                 return false;
//             }
//         }

//         return true;
//     }
// }

// let Ethereum = new Blockchain();
// console.log('Mining block 1...');
// Ethereum.addBlock(new Block(1, "20/07/2017", { amount: 4 }));
// console.log('Mining block 2...');
// Ethereum.addBlock(new Block(2, "20/07/2017", { amount: 8 }));

// console.log(JSON.stringify(Ethereum, null, 4));

// //PRINTING THE VALIDITY


// console.log('Blockchain valid? ' + Ethereum.isChainValid());

// console.log('Changing a block...');
// // Ethereum.chain[1].data = { amount: 100 };
// // Ethereum.chain[1].hash = Ethereum.chain[1].calculateHash();

// console.log("Blockchain valid? " + Ethereum.isChainValid());

// console.log(JSON.stringify(Ethereum, null, 4));








const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
 
Nathan13768609 on Oct 25, 2020

this.index should be removed
AND
this.data should be changed to this.transactions

 
Savjee on Oct 25, 2020 Author Owner

Thanks for the suggestion! This is an old version however.
The latest version already has fixes for this:

Ethereum/src/blockchain.js

Line 93 in 4334165

	 return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex'); 

	Reply…
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let Ethereum = new Blockchain();
Ethereum.createTransaction(new Transaction('address1', 'address2', 100));
Ethereum.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
Ethereum.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', Ethereum.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
Ethereum.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', Ethereum.getBalanceOfAddress('xaviers-address'));