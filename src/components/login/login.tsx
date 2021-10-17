import React from 'react';
import { MyForm } from "./myform";
import axios from "axios";
import ReactNotifications from 'react-notifications-component';
import { UserContext } from '../common/user-context';
import { useHistory } from 'react-router-dom';

import { serviceUrl }  from "../../constants";

import { CSSProperties } from "@material-ui/styles";

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import { useEffect } from "react";

import { useState } from "react";
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";

import './login.css'; 
import loginPic from './login.png';

const Login = () => {

  const history = useHistory();
  let [loading, setLoading] = useState(false);

  const override = css`
  position: fixed;
  left: 0px;
  top: 0px;
  padding-top:300px;
  width: 100%;
  height: 100%;
  z-index: 9999;
    background:rgba(255, 255, 255, 0.6);
`;

  useEffect(() => {

    let jwt = localStorage.getItem("jwt") || "";
    if(jwt || jwt != ''){

      let axiosConfig = {
        headers: {
           "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
        }
      };

      axios.get(serviceUrl + "/validateToken",axiosConfig).then((value)=> {
        if(value.data === "SUCCESS"){
          
          history.push('/devices');

        } else {
          localStorage.removeItem("jwt");
        }
        console.log(value);
      });

    }

  }, []);

  let {  mobile , updateMobile } = React.useContext(UserContext);

    let formCenterCSS : CSSProperties = {
      margin: "0",
      top: "50%",
      textAlign: 'center'
    };

    return (
    <div style={formCenterCSS}>
            <ReactNotifications />

            <header>
  <div className="header__bg"></div>
      <img id="image" src={loginPic} />

      </header>

      <div style={{ marginLeft:20, marginRight: 20}}>
        <h2 id="heading">Sign in</h2>
        <p id="resources">Sign in to access all your resources</p>
        
      <MyForm onSubmit={({phone}) => {

        localStorage.setItem("phone", phone);

        updateMobile(phone);

        setLoading(true);

        axios.post(serviceUrl + "/generateOtp",{
          id:"+91"+phone,
          verificationType: 'PHONE',
          action: 'LOGIN'
        }).then((value)=> {
          if(value.data.status === "FAILURE"){
            store.addNotification({
              content: MyNotify,
              type: "warning",
              container: "top-center"
            });
          }  else {
            history.push('/otp-verify');
          }
          console.log(value);
          setLoading(false);
        });
      }} />
      </div>

      <PulseLoader color={'#fff'} loading={loading} css={override} />

      </div>
      );
  };

  const MyNotify = () => {
    return (
      <div><p style={MyStyles}>Sign up Failed</p> </div>
    );
  }
  
  const MyStyles: CSSProperties = {
    textAlign: 'center'
  }

  export default Login;

  