import xhr from "axios";
import {
  buildTransferTransaction, buildVote, buildAssetParticipate, buildFreezeBalance, buildAssetIssue,
  buildUnfreezeBalance, buildAccountUpdate, buildWitnessUpdate, buildWithdrawBalance, buildWitnessCreate
} from "tronwalletex/src/utils/transactionBuilder";
import {signTransaction} from "tronwalletex/src/utils/crypto";
import {hexStr2byteArray} from "tronwalletex/src/lib/code";

function longToByteArray(/*long*/long) {
  // we want to represent the input as a 8-bytes array
  let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
  for ( let index = 0;index < byteArray.length; index++ ) {
    let byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256 ;
  }

  return byteArray;
}

// function byteArrayToLong(/*byte[]*/byteArray) {
//   var value = 0;
//   for ( var i = byteArray.length - 1; i >= 0; i--) {
//     value = (value * 256) + byteArray[i];
//   }
//
//   return value;
// }

export default class ApiClient {

  // constructor() {
  //   // this.apiUrl = process.env.API_URL;
  // }

    constructor(options = {}) {
        this.apiUrl = options.url || `https://api.tronscan.org`;
    }


    send(token, from, to, amount) {
    let transaction = buildTransferTransaction(token, from, to, amount);
    return (pk) => this.sendTransaction(pk, transaction);
  }

    async addRef(transaction) {



        let {blocks: latestBlock} = await this.getBlocks({

            sort: '-timestamp',

            limit: 1

        });



        latestBlock = latestBlock[0];



        let latestBlockHash = latestBlock.hash;

        let latestBlockNum = latestBlock.number;



        let numBytes = longToByteArray(latestBlockNum);

        numBytes.reverse();

        let hashBytes = hexStr2byteArray(latestBlockHash);



        let generateBlockId = [...numBytes.slice(0, 8), ...hashBytes.slice(8, hashBytes.length - 1)];



        let rawData = transaction.getRawData();

        rawData.setRefBlockHash(Uint8Array.from(generateBlockId.slice(8, 16)));

        rawData.setRefBlockBytes(Uint8Array.from(numBytes.slice(6, 8)));

        rawData.setExpiration(latestBlock.timestamp + (60 * 1000));



        transaction.setRawData(rawData);

        return transaction;

    }

  async sendTransaction(pk, transaction) {
    transaction = await this.addRef(transaction);
    let {hex} = signTransaction(pk, transaction);
    let {data} = await xhr.post(`${this.apiUrl}/api/transaction`, {
      transaction: hex,
    });

    return data;
  }

  async sendTransactionRaw(transactionHex) {
    let {data} = await xhr.post(`${this.apiUrl}/api/transaction`, {
      transaction: transactionHex,
    });

    return data;
  }

  updateAccountName(address, name) {
    let transaction = buildAccountUpdate(address, name);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  updateWitnessUrl(address, url) {
    let transaction = buildWitnessUpdate(address, url);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  withdrawBalance(address) {
    let transaction = buildWithdrawBalance(address);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  freezeBalance(address, amount, duration) {
    let transaction = buildFreezeBalance(address, amount, duration);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  unfreezeBalance(address, amount, duration) {
    let transaction = buildUnfreezeBalance(address);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  applyForDelegate(address, url) {
    let transaction = buildWitnessCreate(address, url);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  voteForWitnesses(address, votes) {
    let transaction = buildVote(address, votes);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  participateAsset(address, issuerAddress, token, amount) {
    let transaction = buildAssetParticipate(address, issuerAddress, token, amount);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  createToken(options) {
    console.log("create token", options);
    let transaction = buildAssetIssue(options);
    return (pk) => this.sendTransaction(pk, transaction);
  }

  async getBlocks(options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/block`, {
      params: {
        sort: '-number',
        limit: 10,
        ...options,
      }
    });

    return {
      blocks: data.data,
      total: data.total,
    };
  }

  async getTransactions(options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/transaction`, {
      params: {
        sort: '-timestamp',
        limit: 50,
        ...options,
      }
    });

    return {
      transactions: data.data,
      total: data.total,
    };
  }

  async getBlockByNumber(number) {
    let {blocks} = await this.getBlocks({
      limit: 1,
      number,
    });

    return blocks[0];
  }

  async getBlockByHash(hash) {
    let {blocks} = await this.getBlocks({
      limit: 1,
      hash,
    });

    return blocks[0];
  }

  async getTransactionByHash(hash) {
    let {data} = await xhr.get(`${this.apiUrl}/api/transaction/${hash}`);
    return data;
  }

  async getAccounts(options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/account`, {
      params: {
        sort: '-balance',
        limit: 50,
        ...options,
      }
    });

    return {
      accounts: data.data,
      total: data.total,
    };
  }

  async getVotes(options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/vote`, {
      params: {
        sort: '-timestamp',
        limit: 50,
        ...options,
      }
    });

    return {
      votes: data.data,
      total: data.total,
    };
  }


  async getAccountByAddress(address) {
    let {data} = await xhr.get(`${this.apiUrl}/api/account/${address}`);
    return data;
  }

  async getVotesForCurrentCycle() {
    let {data} = await xhr.get(`${this.apiUrl}/api/vote/current-cycle`);
    return data;
  }

  async getTransactionStats(options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/transaction/stats`, {
      params: {
        ...options,
      }
    });

    return {
      stats: data,
    };
  }

  async getBlockStats(options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/block/stats`, {
      params: {
        ...options,
      }
    });

    return {
      stats: data,
    };
  }

  async getAddress(address) {
    let {data} = await xhr.get(`${this.apiUrl}/api/account/${address}`);
    return data;
  }

  async getAddressMedia(address) {
    let {data} = await xhr.get(`${this.apiUrl}/api/account/${address}/media`);
    return data;
  }

  async getAddressStats(address) {
    let {data} = await xhr.get(`${this.apiUrl}/api/account/${address}/stats`);
    return data;
  }

  async getTokens(options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/token`, {
      params: {
        sort: '-name',
        limit: 50,
        ...options,
      }
    });

    return {
      tokens: data.data,
      total: data.total,
    }
  }

  async getAccountVotes(address) {
    let {data} = await xhr.get(`${this.apiUrl}/api/account/${address}/votes`);
    return data;
  }

  async getToken(name) {
    let {data} = await xhr.get(`${this.apiUrl}/api/token/${name}`);
    return data;
  }

  async getTokenHolders(name, options = {}) {
    let {data} = await xhr.get(`${this.apiUrl}/api/token/${name}/address`, {
      params: {
        sort: '-balance',
        limit: 50,
        ...options,
      }
    });

    return {
      addresses: data.data,
      total: data.total,
    };
  }

  async getWitnesses() {
    let {data} = await xhr.get(`${this.apiUrl}/api/witness`);

    return {
      witnesses: data,
      total: data.length,
    };
  }

  async getNodeLocations() {
    let {data} = await xhr.get(`${this.apiUrl}/api/nodemap`);

    return {
      nodes: data,
      total: data.length,
    };
  }

  async getAccountBalances(address) {
    let {data} = await xhr.get(`${this.apiUrl}/api/account/${address}/balance`);
    return data;
  }

  async getMarkets() {
    let {data} = await xhr.get(`${this.apiUrl}/api/market/markets`);
    return data;
  }

  async readTransaction(transactionHex) {
    let {data} = await xhr.post(`${this.apiUrl}/api/transaction?dry-run`, {
      transaction: transactionHex,
    });
    return data;
  }
}
