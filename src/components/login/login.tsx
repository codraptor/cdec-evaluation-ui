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
  padding-top:350px;
  width: 100%;
  height: 100%;
  z-index: 9999;
    background:rgba(0, 0, 0, 0.8);
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
      position: "fixed",
      top: "50%",
      marginTop: -100,
      marginLeft: -200,
      left: "50%",
      height: 200,
      width: 400,
      textAlign: 'center'
    };

    return (
    <div >
            <ReactNotifications />


            {/* <header>
  <div className="header__bg"></div>
      <img id="image" src={loginPic} />

      </header> */}
      

      <div className="up_dark_triangle"></div>
      <div className="up_dark_triangle_2"></div>
      <div className="up_dark_triangle_3"></div>

      <div className="up_dark_triangle_4"></div>
      <div className="up_dark_triangle_5"></div>
      <div className="up_dark_triangle_6"></div>

      <div style={formCenterCSS}>
      
      <div style={{ marginLeft:20, marginRight: 20}}>
        <h2 style= {{  color: "#40e0d0", fontFamily: 'Cabin', fontSize: 30}}  id="heading">Sign in</h2>
        <p style= {{  color: "white"}} id="resources">Sign in to access all your resources</p>
        
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
      </div>

      <PulseLoader color={'#40e0d0'} loading={loading} css={override} />

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

  