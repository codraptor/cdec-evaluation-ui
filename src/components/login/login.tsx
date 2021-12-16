import React from 'react';
import { MyForm } from "./myform";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';


import { serviceUrl }  from "../../constants";

import { CSSProperties } from "@material-ui/styles";

import 'react-notifications-component/dist/theme.css';

import { useEffect } from "react";

import { useState } from "react";
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";

import './login.css'; 

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
    console.log(jwt)
    if(jwt || jwt != ''){

      let axiosConfig = {
        headers: {
           "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
        }
      };

      axios.get(serviceUrl + "/validateToken",axiosConfig).then((value)=> {
        console.log(value)
        if(value.data === "SUCCESS"){   
          history.push('/data-verification');
        } else {
          localStorage.removeItem("jwt");
        }
        console.log(value);
      });

    }

  }, []);

    let formCenterCSS : CSSProperties = {
      position: "fixed",
      top: "50%",
      marginTop: -200,
      marginLeft: -200,
      left: "50%",
      height: 200,
      width: 400,
      textAlign: 'center'
    };

    return (
    <div >
      
      <div style={formCenterCSS}>
      
      <div style={{ marginLeft:20, marginRight: 20}}>
        <h2 style= {{  color: "#40e0d0", fontFamily: 'Cabin', fontSize: 30}}  id="heading">Sign in</h2>
        <p style= {{  color: "white"}} id="resources">Sign in to the data validation portal</p>
        
      <MyForm onSubmit={({username, password}) => {

        setLoading(true);

        axios.post(serviceUrl + "/login",{
          username:username,
          password: password
        }).then((value)=> {
          if(value.data.status === "FAILURE"){
            toast.error("Login Failed", {
              position: toast.POSITION.TOP_CENTER,
              closeButton: false,
              hideProgressBar : true,
              icon: false,
              autoClose: 3000
            });
          }  else {
              localStorage.setItem("jwt", value.data.jwt);
              history.push('/data-verification');
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
  
  const MyStyles: CSSProperties = {
    textAlign: 'center',
  }

  export default Login;

  