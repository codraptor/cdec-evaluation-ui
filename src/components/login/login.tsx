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
import { Card } from '@material-ui/core';


const Login = () => {

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

  let {  mobile , updateMobile } = React.useContext(UserContext);

    let formCenterCSS : CSSProperties = {
      margin: "0",
      top: "50%",
      textAlign: 'center'
    };

    return (
    <div style={formCenterCSS}>
            <ReactNotifications />
            <Card style={{ 
                    marginLeft: 20, marginRight: 20, marginTop: 40,
                    paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ marginLeft:20, marginRight: 20 }}>
      <MyForm onSubmit={({phone}) => {

        localStorage.setItem("phone", phone);

        updateMobile(phone);

        axios.post(serviceUrl + "/generateOtp",{
          id:phone,
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
        });
      }} />
      </div>
      </Card>
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

  