import {SET_WALLETS_BALANCE, SET_WALLETS, SET_TOKENS ,
    DELETE_BALANCES, DELETE_WALLET , SET_LANGUAGE  ,SET_WITNESSES , SET_VOTE_LIST , SET_VOTE_TIMER} from "./actionTypes";

import {addSeconds} from "date-fns";
import {Client} from "@tronscan/client" ;


export const setWallet = (address, key, name) => ({

    type: SET_WALLETS, address, key, name

});



export const addWallet = (address, key, name) => (dispatch) => {
    dispatch(setWallet(address, key, name))
};


export const setTokenBalances = (representative= {},
                                 accountType,
                                 name,
                                 address,
                                 bandwidth={},
                                 balances=null,
                                 balance=null ,
                                 tokenBalances = null ,
                                 trc20token_balances=null,
                                 frozen={},
                                 accountResource={}) =>
    ({

        type: SET_WALLETS_BALANCE,

        representative,
        accountType,
        name,
        address,
        bandwidth,
        balances,
        balance,
        tokenBalances,
        trc20token_balances,
        frozen,
        accountResource

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

    let {
        representative,
        accountType,
        name,
        address,
        bandwidth,
        balances=null,
        balance,
        tokenBalances= null ,
        trc20token_balances = null ,
        frozen,
        accountResource

    } = await x.getAccountByAddress(myAddress);



    // dispatch(setTokenBalances(address,balance , balances , bandwidth , frozen , name , representative));
    dispatch(setTokenBalances( representative,
        accountType,
        name,
        address,
        bandwidth,
        balances,
        balance,
        tokenBalances,
        trc20token_balances,
        frozen,
        accountResource));

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

    let assets = await new Client().getTokens();

    dispatch(setTokens(assets));
};




//actions for Voting

export const setVoteList = (voteList) => ({
    type: SET_VOTE_LIST,
    voteList
});


export const setVoteTimer = (voteTimer) => ({
    type: SET_VOTE_TIMER,
    voteTimer
});


export const loadVoteList = () => async (dispatch) => {
    let {candidates} = await new Client().getVotesForCurrentCycle();
    dispatch(setVoteList(candidates));
};


export const loadVoteTimer = () => async (dispatch) => {
    let timeUntilNext = await new Client().secondsUntilNextCycle();
    dispatch(setVoteTimer(addSeconds(new Date(), timeUntilNext)));
};