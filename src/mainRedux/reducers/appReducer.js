
import {SET_LANGUAGE , SET_PRICE , SEARCH} from "../../mainRedux/actions/actionTypes";

const initialState = {

    price: {
        usd: 0,
        percentage: 0,
    },

    availableLanguages: {
        // nl: "Nederlands",
        en: "English",
        // zh: "简体中文",
        fa:"فارسی",
        ko:"한국어",
        br: "Português Brasil",
        fr: "Français",
        es: "Español" ,
    },

    activeLanguage: 'en',

    searchString: '',
};


export function appReducer(state = initialState, action) {

    switch (action.type) {



        case SET_PRICE: {

            return {
                ...state,
                price: {
                    usd: action.price,
                    percentage: action.percentage,
                }
            }
        }

        case SET_LANGUAGE: {

            let language = action.language;

            if (typeof state.availableLanguages[action.language] === 'undefined') {
                language = 'en';
            }

            // Lockr.set("language", language);

            return {
                ...state,
                activeLanguage: language,
            };
        }

        case SEARCH: {
            return {
                ...state,
                searchString: action.searchString
            }
        }

        default:
            return state;
    }

}
