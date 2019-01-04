const TronWeb = require('tronweb');

// This provider is optional, you can just use a url for the nodes instead
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider('https://api.trongrid.io'); // Full node http endpoint
const solidityNode = new HttpProvider('https://api.trongrid.io'); // Solidity node http endpoint
const eventServer = new HttpProvider('https://api.trongrid.io'); // Contract events http endpoint
const MAIN_ABI = [{
    "constant": true,
    "inputs": [],
    "name": "getBalance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_feeToRegister", "type": "uint256"}],
    "name": "updateFeeToRegister",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "name", "type": "string"}, {"name": "myaddress", "type": "address"}],
    "name": "addWallet",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "changeOwner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "name", "type": "string"}],
    "name": "add",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_balance", "type": "uint256"}],
    "name": "updateBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "name", "type": "string"}],
    "name": "getAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getSize",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "mySelfDestruct",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
}];

const privateKey = '6FE16021421613EB79FD48D40448B7B532C12A9EA18B57DBBE041BCAB580E28F';
//const privateKey = '6FE16021421613EB79FD48D40448B7B532C12A9EA18B57DBBE041BCAB580E28F' ;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);


export async function getAddress(name) {
    //const newContract = await tronWeb.contract().at("");
    const newContract = await tronWeb.contract(MAIN_ABI, "TKvNjUuaLDpGkuNpiTAQpB4YpWfcvabPwm");

    const y = await newContract.getAddress(name).call();

    const address = tronWeb.address.fromHex(y);

    console.log("address in getAddress function  : ", address);
    return address;


}



