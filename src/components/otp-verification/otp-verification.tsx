import { OTPVerificationForm } from "./otp-verification-form";
import axios from "axios";
import ReactNotifications from 'react-notifications-component';
import { useHistory } from 'react-router-dom';
import { useEffect } from "react";
import { serviceUrl }  from "../../constants";

import { CSSProperties } from "@material-ui/styles";

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import { useMobile } from '../common/user-context';
import { Card } from '@material-ui/core';

import './otp.css'; 
import otpPic from './otp.png';

import { useState } from "react";
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";

const OTPVerification = () => {

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

    let mobile = useMobile().mobile;

    mobile = localStorage.getItem("phone") || "";

    let formCenterCSS : CSSProperties = {
      margin: "0",
      top: "50%",
      textAlign: 'center'
    };

    console.log("mobile from context is: " + mobile);

    return (
    <div style={formCenterCSS}>
            <ReactNotifications />
                     
                      <header id="header-otp">
  <div id="header-bg-otp"></div>
                      <img id="image-otp" src={otpPic} />
                      </header>
                      <div style={{ marginLeft:20, marginRight: 20 }}>
        <h2 id="heading">One Time Password</h2>
        <p id="otp">Please enter the received OTP</p>
      <OTPVerificationForm onSubmit={({password}) => {

        setLoading(true);

        axios.post(serviceUrl + "/login",{
          id:"+91"+mobile,
          verificationType: 'PHONE',
          password: password
        }).then((value)=> {
          if(value.data.status === "FAILURE"){
            store.addNotification({
              content: MyNotify,
              type: "warning",
              container: "top-center"
            });
          } else {
            localStorage.setItem("username", value.data.username);
            localStorage.setItem("jwt", value.data.jwt);
            history.push('/devices');
          }
          console.log(value);
          setLoading(false);
        })
      }} />
      </div>

      <PulseLoader color={'#fff'} loading={loading} css={override} />

      </div>
      );
  };

  const MyNotify = () => {
    return (
      <div><p style={MyStyles}>Login Failed</p> </div>
    );
  }
  
  const MyStyles: CSSProperties = {
    textAlign: 'center'
  }

  export default OTPVerification;