import {combineReducers} from "redux";
import {appReducer} from "./appReducer";
import {reducer as formReducer} from "redux-form";
import walletsReducer from './welletsReducer';
import balancesReducer from './balancesReducer' ;
import voteReducer from './voteReducer' ;
import tokensReducer from "./tokensReducer" ;

export default combineReducers({

    balancesReducer: balancesReducer,
    walletsReducer: walletsReducer,
    voteReducer: voteReducer,
    tokensReducer:tokensReducer ,
    app: appReducer,
    form: formReducer
});
