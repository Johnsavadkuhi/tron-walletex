import {DELETE_BALANCES, SET_WALLETS_BALANCE} from "../../mainRedux/actions/actionTypes";



const initialState ={

    walletBalances : [

        { representative:
                { enabled: false, lastWithDrawTime: 0, allowance: 0, url: '' },
            accountType: '0',
            name: '',
            address: '',
            bandwidth:
                { freeNetUsed: 0,
                    freeNetLimit: 0,
                    freeNetRemaining: 0,
                    freeNetPercentage: 0,
                    netUsed: 0,
                    netLimit: 0,
                    netRemaining: 0,
                    netPercentage: 0,
                    assets: {},
                    energyUsed: 0,
                    energyLimit: 0,
                    energyRemaining: 0,
                    energyPercentage: 0,
                    storageUsed: 0,
                    storageLimit: 0,
                    storageRemaining: 0,
                    storagePercentage: 0,
                    totalNetLimit: 0,
                    totalNetWeight: 0,
                    totalEnergyLimit: 0,
                    totalEnergyWeight: 0 },
            balances: [] ,
            balance: 0,
            tokenBalances: [] ,
            trc20token_balances: [],
            frozen: { total: 0, balances: [] },
            accountResource:
                { frozen_balance_for_energy: { expire_time: 0, frozen_balance: 0 } }

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

                            representative:{...action.representative  } ,
                            accountType : action.accountType ,
                            name:action.name ,
                            address : action.address ,
                            bandwidth:{...action.bandwidth},
                            balances:[...action.balances || 0 ],
                            balance:action.balance ,
                            tokenBalances:[...action.tokenBalances || 0] ,
                            trc20token_balances:[...action.trc20token_balances || 0 ]   ,
                            frozen:{...action.frozen},
                            accountResource : {...action.accountResource}

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
