import { OTPVerificationForm } from "./data-verification-form";
import axios from "axios";
import ReactNotifications from 'react-notifications-component';
import { useHistory } from 'react-router-dom';
import { useEffect } from "react";
import { serviceUrl }  from "../../constants";

import { CSSProperties } from "@material-ui/styles";

import { Button } from '@material-ui/core';
import 'react-notifications-component/dist/theme.css';

import { toast } from 'react-toastify';

import { useMobile } from '../common/user-context';
import { Card } from '@material-ui/core';

import './data-verification.css'; 
import otpPic from './otp.png';

import { useState } from "react";
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";

const DataVerification = () => {

  const history = useHistory();
  let [loading, setLoading] = useState(false);
  let [entry, setEntry] = useState({
    id: "",
    node: "",
    language: "",
    inlinkTitle: "",
    context: "",
    wikipediaTitle: "",
    wikipediaDescription: ""
  });

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

  let getEntry = () => {

    let axiosConfig = {
      headers: {
         "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
      }
    };

    axios.get(serviceUrl + "/getEntry", axiosConfig)
        .then((value) => {
          setLoading(false);
          console.log("data")
          console.log(value.data)
          if(value.data==="" || value.data==null ){
            setEntry({
              id: "",
              node: "",
              language: "",
              inlinkTitle: "",
              context: "",
              wikipediaTitle: "",
              wikipediaDescription: ""
            });
          } else {
                setEntry(value.data);
          }

        })
  }

  useEffect(() => {

    setLoading(true);

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
        } else {
          localStorage.removeItem("jwt");
          history.push('/');
        }
        console.log(value);
      });

    }

    let axiosConfig = {
      headers: {
         "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
      }
    };

    getEntry();

  }, []);

    let formCenterCSS : CSSProperties = {
      position: "fixed",
      top: "20%",
      marginTop: -100,
      marginLeft: -650,
      left: "50%",
      height: 500,
      width: 1300,
      textAlign: 'center'
    };


    let logout = () => {

      localStorage.removeItem("username");
      localStorage.removeItem("jwt");
      localStorage.removeItem("phone");

      history.push("/");
    }

    let buttonclick = (option : string) => {
      setLoading(true);

      let axiosConfig = {
        headers: {
            "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
        }
      };                    

      axios.post(serviceUrl + "/updateEntry",{
        id:entry.id,
        response: option
      },axiosConfig).then((value)=> {
        if(value.data.status === "FAILURE"){
          toast.error("Response could not be captured. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
            closeButton: false,
            hideProgressBar : true,
            icon: false,
            autoClose: 3000
          });
        } else {
          getEntry();
          //window.location.reload();
          //history.push('/data-verification');
        }
        console.log(value);
        setLoading(false);
      })
}

    return (
    <div style={formCenterCSS}>
            <ReactNotifications />



        <div style={{ marginLeft:20, marginRight: 20 }}>
        <h2 style= {{  color: "#40e0d0", fontFamily: 'Cabin', fontSize: 30}} id="heading">Data Validation</h2>

        { (entry==null || entry.id === "") && 
        <p style= {{  color: "white", marginTop: 200}} id="otp">Thank you! All entries are validated.</p> 
        }
        { (entry!=null && entry.node!="") && <div> 
        <p style= {{  color: "white", fontWeight: 600}} id="otp">Please check if the span marked as &lt;a&gt;...&lt;/a&gt; in the context pertains to the mentioned Wikipedia page</p> 

        <div style={{marginTop:15,color:"turquoise", fontFamily: 'Cabin', fontSize: 22 }} >Wikipedia Page: </div>
        <div style={{ marginTop:5, color: "white", fontFamily: 'Cabin', fontSize: 20  }}>{entry.wikipediaTitle}</div>
        <div style={{marginTop:15,color:"turquoise", fontFamily: 'Cabin', fontSize: 22 }} >Page Description: </div>
        <div style={{ marginTop:5, color: "white", fontFamily: 'Cabin', fontSize: 20  }}>{entry.wikipediaDescription}</div>
        <div style={{marginTop:15,color:"turquoise", fontFamily: 'Cabin', fontSize: 22 }} >Context Page Title: </div>
        <div style={{ marginTop:5, color: "white", fontFamily: 'Cabin', fontSize: 20  }}>{entry.inlinkTitle}</div>
        <div style={{marginTop:15,color:"turquoise", fontFamily: 'Cabin', fontSize: 22 }} >Context: </div>
        <div style={{ marginTop:5, color: "white", fontFamily: 'Cabin', fontSize: 20  }}>{entry.context}</div>
        

        <div>
        <Button style= {{ color: "#000", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin', marginLeft : 10, marginTop: 30,
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#4fb" , fontSize: 18 , boxShadow: "0px 0px 6px #fff"
                        }}
                        
                        type="button" onClick={(() => buttonclick("CORRECT"))}>Correct</Button>

        <Button style= {{ color: "#fff", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin', marginLeft : 10, marginTop: 30,
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#f44" , fontSize: 18 , boxShadow: "0px 0px 6px #fff"
                        }}
                        
                        type="button" onClick={(() => buttonclick("INCORRECT"))}>Incorrect</Button>

        <Button style= {{ color: "#000", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin', marginLeft : 10, marginTop: 30,
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#fff" , fontSize: 18 , boxShadow: "0px 0px 6px #fff"
                        }}
                        
                        type="button" onClick={(() => buttonclick("UNSURE"))}>Not Sure</Button>
          </div>
        </div>}

      <div>
      <div style= {{  color: "white", marginTop: 80}} id="otp">To logout please</div> 
      <Button style= {{ color: "#4ff", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin', marginLeft : 10,
                        paddingRight: 40, paddingBottom: 10,
                        background : "#000" , fontSize: 18 
                        }}
                        
                        type="button" onClick={logout}>Click Here!</Button>
      </div>
      </div>

      <PulseLoader color={'#40e0d0'} loading={loading} css={override} />

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

  export default DataVerification;