

const TronWeb = require('tronweb');

// This provider is optional, you can just use a url for the nodes instead
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider('https://api.shasta.trongrid.io'); // Full node http endpoint
const solidityNode = new HttpProvider('https://api.shasta.trongrid.io'); // Solidity node http endpoint
const eventServer = new HttpProvider('https://api.shasta.trongrid.io'); // Contract events http endpoint

const privateKey = '';
//const privateKey = '6FE16021421613EB79FD48D40448B7B532C12A9EA18B57DBBE041BCAB580E28F' ;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);

//
// async function addShorten() {
//
//     const newContract =  await tronWeb.contract().at("TWiJLYLeJNbAP7jAtWX9atveesAP6XSofk") ;
//    // const newContract  = new tronWeb.contract([{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"myaddress","type":"address"}],"name":"addWallet","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"name","type":"string"}],"name":"getWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}] , "TWiJLYLeJNbAP7jAtWX9atveesAP6XSofk")
//
//     console.log(newContract) ;
//
//
//     // tronWeb.trx.getTransactionInfo().then(accountInfo => {
//     //
//     //      const contractResult  =  accountInfo.contractResult ;
//     //      console.log("Result :  " , contractResult) ;
//     //      console.log( JSON.stringify(accountInfo, null, 2), '\n');
//     //
//     //
//     //  }).catch(err => console.error(err));
//     //
//
//
//
//
// }


export async  function getAddress(name )
{
    const newContract =  await tronWeb.contract().at("THc7KKZKGmTa5VB9brXPajdgMNqbe2KWao") ;
   // const newContract  = await tronWeb.contract([{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"myaddress","type":"address"}],"name":"addWallet","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"name","type":"string"}],"name":"getWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}] , "TFrohtnFcGqUkfkqhx2cu64fb7Pyg5A8Dt")

    const y  = await newContract.getWallet(name).call() ;

    const address = tronWeb.address.fromHex(y) ;

    console.log("address in getAddress function  : " , address);
    return address ;


}

//
// async function addWalletAddress(name , address)
// {
//     const newContract =  await tronWeb.contract().at("TWiJLYLeJNbAP7jAtWX9atveesAP6XSofk") ;
//
//     const xx = await  tronWeb.trx.getTransactionInfo('6ceea9287f48fc235717707ded53f38d6d3f456f8606a4e7ce19ccba90e5b701')  ;
//     console.log(xx);
//     if(address.length === 34 && name.length !==0 )
//     {
//
//         const hashId = await  newContract.addWallet(name , address).send() ;
//         console.log("hash : " , hashId) ;
//         return await  tronWeb.trx.getTransactionInfo(hashId)  ;
//
//     }
//
//
//
//
// }
//
// //
// // addWalletAddress("john1.tron"  , "TWiJLYLeJNbAP7jAtWX9atveesAP6XSofk").then(output =>{
// //     console.log(output) ;
// // }) ;
//
// async  function getTransactionInfo (hashId)
// {
//
//     const info = await  tronWeb.trx.getTransactionInfo(hashId)  ;
//     console.log(info);
//
// }
//
//
