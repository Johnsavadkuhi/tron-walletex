import {DELETE_WALLET, SET_WALLETS} from "../../mainRedux/actions/actionTypes";


const initialState ={

    wallets : [

        {address :'' , key:'' , name :''}


    ]

};

const walletsReducer = (state = {wallets:[]}, action) => {




    switch (action.type) {



        case SET_WALLETS :


            state = {

                ...state,

                wallets:

                    [...state.wallets,

                        {
                            address: action.address,
                            key: action.key,
                            name:action.name ,
                        }

                    ]
            };


            break;

        case DELETE_WALLET :

            return {

                ...state ,

                wallets:state.wallets.filter(wallet =>
                {
                    return wallet.address !== action.address ;
                })
            };


        default:
            return state;
    }

    return state;

};

export default walletsReducer;
