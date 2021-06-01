import React from "react";
import { BrowserRouter as HashRouter, Route, Switch } from 'react-router-dom';
import Devices from "./components/device-list/device-list.jsx";
import Header from "./components/header/header";
import Login from "./components/login/login";
import { UserContextProvider } from './components/common/user-context';
import OTPVerification from "./components/otp-verification/otp-verification";



const App = () => {
  return (
    <HashRouter>
  <div style={{ textAlign : "center" }}>
    <Header />
    <UserContextProvider>

    <Switch>

      <Route exact path="/">
        <Login />
      </Route>
      <Route path="/devices">
        <Devices />
      </Route>
      <Route path="/otp-verify">
        <OTPVerification />
      </Route>

    </Switch>

    </UserContextProvider>

    </div>
    </HashRouter>
    );
};


export default App;
