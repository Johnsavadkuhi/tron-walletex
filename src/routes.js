import Account from "./components/account/Account";
// import Votes from "./components/account/Votes";
import TDNS from "./components/transfer/TDNS";
import AddWallet from "./components/wallet/addWallet/AddWallet";
import Note from "./components/Notifications/Note";


export const routes = [


    {
        path:"/TDNS",
        label:"tdns",
        component:TDNS ,

    },


    {
        path: "/AddWallet",
        showInMenu: false,
        component: AddWallet,
    },
    // {
    //     path: "/CreateToken",
    //     showInMenu: false,
    //     component: CreateToken,
    // },

    // {
    //     path: "/BuyToken",
    //     showInMenu: false,
    //     component: BuyToken,
    // },

    // {
    //     path: "/account/votes",
    //     showInMenu: false,
    //     component: Votes,
    // },

    {
        path: "/account",
        showInMenu: false,
        component: Account,
    },
    {
        path: "/",
        label: "TronWalletEx",
        showInMenu: false,
        component: Note,
    },

];

