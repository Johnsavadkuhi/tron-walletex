import {SET_WITNESSES} from "../actions/actionTypes";


const initialState = {
    witnesses: [],
};

const  voteReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_WITNESSES: {
            return {
                ...state,

                witnesses: action.witnesses,

            };
        }

        default:
            return state;
    }
};

export default  voteReducer ;

