import {SET_VOTE_LIST, SET_VOTE_TIMER} from "../actions/actionTypes";

const initialState = {
    voteList: [],
    voteTimer: 0,
};

const votesReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_VOTE_LIST: {
            return {
                ...state,
                voteList: action.voteList,
            };
        }

        case SET_VOTE_TIMER: {
            return {
                ...state,
                voteTimer: action.voteTimer,
            };
        }

        default:
            return state;
    }
};

export default votesReducer;

