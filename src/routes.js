// import Accounts from "./components/Accounts";
// import Nodes from "./components/network/Nodes";
// import Representatives from "./components/network/Representatives";
import TokensCreate from "./components/tokens/TokenCreate";
// import TokensView from "./components/tokens/TokensView";
import Account from "./components/account/Account";
// import ApplyForDelegate from "./components/account/ApplyForDelegate";
// import Transactions from "./components/account/Transactions";
import Votes from "./components/account/Votes";
import Send from "./components/transfer/Send";
import Receive from "./components/transfer/Receive";
import AddWallet from "./components/wallet/AddWallet";
import BuyToken from "./components/wallet/BuyToken";
import CreateToken from "./components/wallet/CreateToken";
import NotForAccountPage from "./components/Notifications/NotForAccountPage";


import TokensView from "./components/wallet/TokensView";

export const routes = [

  // {
  //   path: "/tokens",
  //   label: "tokens",
  //   components: TokensView,
  //   routes: [
  //     {
  //       label: "view",
  //       path: "/tokens/view",
  //       components: TokensView,
  //       icon: ''
  //     },
  //     {
  //       label: "create",
  //       path: "/tokens/create",
  //       components: TokensCreate,
  //       icon: ''
  //     }
  //   ],
  //   // search: {
  //   //   label: "search",
  //   //   components: SearchBar,
  //   //   exclude: "/tokens/create",
  //   //   placeholder: "search_token"
  //   // }
  // },


  {
    path: "/send",
    label: "send",
    component: Send,
    icon: "fa fa-paper-plane mr-2",
    showLoggedIn: true
  },

  {
    path: "/receive",
    label: "receive",
    component: Receive,
    icon: "fa fa-qrcode mr-2",
    showLoggedIn: true
  },

    {
      path:"/AddWallet",
        showInMenu:false ,
        component:AddWallet,
    },
    {
        path:"/CreateToken",
        showInMenu:false ,
        component:CreateToken,
    },

    {
        path:"/BuyToken",
        showInMenu:false ,
        component:BuyToken,
    },

    {
        path: "/account/votes",
        showInMenu: false,
        component: Votes,
    },
    {
        path: "/TokensView",
        shoInMenu:false ,
        components:TokensView,
    },

  {
    path: "/account",
    showInMenu: false,
    component: Account,
  },
    {
        path: "/",
        label: "TronWalletEx",
        showInMenu: false,
        component: NotForAccountPage,
    },

];

