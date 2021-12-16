import React from "react";
import { BrowserRouter as HashRouter, Route, Switch } from 'react-router-dom';
import Devices from "./components/device-list/device-list.jsx";
import Header from "./components/header/header";
import Login from "./components/login/login";
import { UserContextProvider } from './components/common/user-context';
import DataVerification from "./components/data-verification/data-verification";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'


const App = () => {
  return (
    <HashRouter>
      
  <div style={{ textAlign : "center" }}>

    <div style={{color:'white', backgroundColor:'#40e0d0', textAlign:'center',
     fontFamily:'Cabin', fontSize:20, boxShadow:'solid 1px white'}}>
    <ToastContainer toastClassName={() => "notification-body"} />
    </div>

    {/* <Header /> */}
    <UserContextProvider>

    <Switch>

      <Route exact path="/">
        <Login />
      </Route>
      <Route path="/devices">
        <Devices />
      </Route>
      <Route path="/data-verification">
        <DataVerification />
      </Route>

    </Switch>

    </UserContextProvider>

    </div>
    </HashRouter>
    );
};


export default App;
