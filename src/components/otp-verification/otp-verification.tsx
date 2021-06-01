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


const OTPVerification = () => {

  const history = useHistory();

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
            <Card style={{ 
                    marginLeft: 20, marginRight: 20, marginTop: 40,
                    paddingTop: 80, paddingBottom: 80 }}>
                      <div style={{ marginLeft:20, marginRight: 20 }}>
      <OTPVerificationForm onSubmit={({password}) => {
        axios.post(serviceUrl + "/login",{
          id:mobile,
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
        })
      }} />
      </div>
      </Card>
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