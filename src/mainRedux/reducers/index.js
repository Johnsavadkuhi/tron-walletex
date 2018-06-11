import {combineReducers} from "redux";
import {appReducer} from "./appReducer";
import {reducer as formReducer} from "redux-form";
import walletsReducer from './welletsReducer';
import balancesReducer from './balancesReducer' ;
import voteReducer from './voteReducer' ;
import tokensReducer from "./tokensReducer" ;
import votesReducer from './votesReducer' ;

export default combineReducers({

    balancesReducer: balancesReducer,
    walletsReducer: walletsReducer,
    voteReducer: voteReducer,
    tokensReducer:tokensReducer ,
    votes:votesReducer,
    app: appReducer,
    form: formReducer
});
