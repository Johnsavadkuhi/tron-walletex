import {SET_WALLETS_BALANCE, SET_WALLETS, SET_TOKENS ,
    DELETE_BALANCES, DELETE_WALLET , SET_LANGUAGE  ,SET_WITNESSES} from "./actionTypes";

import {Client} from "@tronscan/client" ;


export const setWallet = (address, key, name) => ({

    type: SET_WALLETS, address, key, name

});



export const addWallet = (address, key, name) => (dispatch) => {
    dispatch(setWallet(address, key, name))
};



export const setTokenBalances = (address, balance,balances = [] , bandwidth={} , frozen = {}, name , representative = {},
                                 ) =>
    ({

    type: SET_WALLETS_BALANCE,

    address,balance , balances, bandwidth , frozen , name ,  representative

    });


export const deleteBalances = (address) => ({
    type: DELETE_BALANCES,
    address
});


export const removeWallet = (address) => ({
    type: DELETE_WALLET,
    address
});


export const loadTokenBalances = (myAddress) => async (dispatch) => {

    let x = new Client();
    let {address,balance , balances, bandwidth , frozen , name ,  representative} = await  x.getAccountByAddress(myAddress);

    dispatch(setTokenBalances(address,balance , balances , bandwidth , frozen , name , representative));

};



export const deleteTokensBalances = (myAddress) => (dispatch) => {

    dispatch(deleteBalances(myAddress));

};



export const deleteWallet = (myAddress) => (dispatch) => {

    dispatch(removeWallet(myAddress));
    dispatch(deleteTokensBalances(myAddress));

};


export const setWitnesses = (witnesses = []) => ({
    type: SET_WITNESSES,
    witnesses,
});


export const setTokens = (tokens = []) => ({

    type: SET_TOKENS,
    tokens,


});


export const loadWitnesses = () => async (dispatch) => {

    const getW = new Client();

    dispatch(setWitnesses(await getW.getWitnesses()));

};


export const setLanguage = (language = 'en') => ({
    type: SET_LANGUAGE,
    language,
});


export const loadTokens = () => async (dispatch) => {

    let assets = await new Client().getAssetIssueList();

    dispatch(setTokens(assets));
};