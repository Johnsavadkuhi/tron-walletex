import {DELETE_BALANCES, SET_WALLETS_BALANCE} from "../../mainRedux/actions/actionTypes";


const initialState ={

    walletBalances : [
        {
            address:'',
            balance: 0,
            balances: [],
            bandwidth:{ assets:{}, freeNetUsed: 0, freeNetLimit: 0, freeNetRemaining: 0, freeNetPercentage: 0, netUsed: 0  },
            frozen:{total:0 , balances:[]},
            name: '',
            representative: {allowance:0 , enabled:false  , lastWithDrawTime:0, url:null} ,

        }

    ]

};

const balancesReducer = (state =initialState, action) => {


    switch (action.type) {

        case SET_WALLETS_BALANCE:

            state = {

                ...state,

                walletBalances:

                    [...state.walletBalances,

                        {

                            address : action.address ,
                            balance:action.balance,
                            balances:[...action.balances],
                            bandwidth:{...action.bandwidth},
                            frozen:{...action.frozen},
                            name:action.name ,
                            representative:{...action.representative },

                        }
                    ]
            };

            break;

        case DELETE_BALANCES :

            return {
                ...state ,
                walletBalances:state.walletBalances.filter(walletBalance => {
                    return walletBalance.address !== action.address ;
                })
            };

        default:
            return state;
    }

    return state;

};

export default balancesReducer;
