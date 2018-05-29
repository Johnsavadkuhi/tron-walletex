
import {SET_TOKENS} from "../actions/actionTypes";


 const tokensReducer = (state ={} , action) =>{

    switch (action.type)
    {
        case SET_TOKENS :

            return {
                ...state ,
                tokens:action.tokens ,
                total :action.total

            };

        default :
            return state ;

    }

};

export  default  tokensReducer ;
