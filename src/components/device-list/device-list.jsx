import axios from 'axios';
import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import SockJsClient from 'react-stomp';
import Modal from 'react-modal';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { serviceUrl }  from "../../constants";

import { Card } from '@material-ui/core';
import { Button } from '@material-ui/core';

import Switch from 'react-ios-switch';
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";

import './device-list.css';

import TimeField from 'react-simple-timefield';

// import * as SockJS from 'sockjs-client';

//const client = new W3CWebSocket('ws://turquoise-burglar-mqtt.herokuapp.com/ws-message');

const customStyles = {
    content : {
      top                   : '50%',
      bottom                : 'auto',
      transform             : 'translate(0%, -50%)',
      textAlign             : 'center',
      paddingBottom         : '40px',
      backgroundColor       : 'black',
      background            : '0, 0, 0, 0.8',
      boxShadow             : '0px 0px 12px #000'
    }
  };

Modal.setAppElement('#root')

const Devices = () => {   

  const history = useHistory();

  let [loading, setLoading] = useState(false);
  let [onTime, setOnTime] = useState('');
  let [offTime, setOffTime] = useState('');

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

    // client.onopen = () => {
    //     console.log('WebSocket Client Connected');
    //    };

    //    client.onmessage = (message) => {
    //     console.log(message);
    //   };

  const [currentDevice, setDevice] = React.useState( {friendlyId: "", name:"", state: "", controlStatus: "" });

  var subtitle;

  const [modalIsOpen,setIsOpen] = React.useState(false);

  function openModal(device) {
    setDevice(device);
    setOnTime(device.buttonTime === null ? '00:00:00' : device.buttonTime.onTime);
    setOffTime(device.buttonTime === null ? '00:00:00' : device.buttonTime.offTime);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#fff';
  }

  function closeModal() {
    setDevice(null);
    setIsOpen(false);
    setOnTime('');
    setOffTime('');
  }

  function setTime(device) {

    let username = localStorage.getItem("username") || "";

      let axiosConfig = {
        headers: {
            "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
        }
      };

      setLoading(true);
      setTimeout(() => setLoading(false), 5000);

        axios.post(serviceUrl + "/setButtonTime",
        {"username":username,
      "onTime":onTime,
      "offTime":offTime,
    "buttonId": device.id}, axiosConfig)
        .then((value) => {
            console.log(value);
            //setLoading(false);
            //window.location.reload();
        })
  }

  function switchDevice(device) {

    let username = localStorage.getItem("username") || "";

      let axiosConfig = {
        headers: {
            "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
        }
      };

      setLoading(true);
      setTimeout(() => setLoading(false), 5000);

        axios.post(serviceUrl + "/toggleButton",
        {"username":username,
      "value": device.state.value && device.state.value === "ON"? "OFF" : "ON",
    "buttonId": device.id}, axiosConfig)
        .then((value) => {
            console.log(value);
            //setLoading(false);
            //window.location.reload();
        })
  }

   
    const [devices, setDevices] = useState([
        {id: "", name:"", state: { "value" : ""}}
    ]);

    const [_, updateState] = useState("");

    let updateScreen = () => {
        updateState();
    }

    let logout = () => {

      localStorage.removeItem("username");
      localStorage.removeItem("jwt");
      localStorage.removeItem("phone");

      history.push("/");
    }


    useEffect(() => {


        let username = localStorage.getItem("username") || "";
        let jwt = localStorage.getItem("jwt") || "";

        let axiosConfig = {
          headers: {
             "Authorization": "Bearer " + jwt          
            }
        };

        
        if(jwt || jwt != ''){

          let axiosConfig = {
            headers: {
               "Authorization": "Bearer " + jwt
            }
          };

          setLoading(true);
    
          axios.get(serviceUrl + "/validateToken",axiosConfig).then((value)=> {

            if(value.data === "SUCCESS"){
                  
            } else {
              setLoading(false);
              localStorage.removeItem("jwt");
              history.push('/');
            }
            
            console.log(value);
          }).catch(
            (error) => {
              // setLoading(false);
              // localStorage.removeItem("jwt");
              // history.push('/');
            }
          );
    
        } else {
          history.push('/');
        }

        axios.post(serviceUrl + "/getButtonsByAccess",
        {"username":username}, axiosConfig)
        .then((value) => {
                setDevices(value.data);
                setLoading(false);
        })
    }, []);

    const customHeaders = {
      "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
  };

    return (
    <div>

<Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2 style={{ fontFamily:"montserrat", textAlign:"center", marginTop:50, color: "000" }} ref={_subtitle => (subtitle = _subtitle)}>Switch</h2>

          <Button style={{ color: "#000", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin',
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#40e0d0" , fontSize: 18 , boxShadow: "0px 0px 6px #40e0d0"
                        }}
           onClick={() => {switchDevice(currentDevice)}}>{currentDevice && currentDevice.state.value==='OFF' ? 'SWITCH ON' : 'SWITCH OFF'}</Button> 
      
          <h2 id="setTime" style={{ color: '#40e0d0', fontFamily:"montserrat", textAlign:"center", 
          marginTop:50 }} ref={_subtitle => (subtitle = _subtitle)}>Set Time</h2>

          <div>
          
          <span style={{ fontFamily:"montserrat", textAlign:"center", fontWeight: 600, color: '#fff' }}>
            ON TIME: &nbsp;</span> 
            <TimeField style={{ fontSize: 20, color: 'white', backgroundColor:'black', 
            marginLeft: 20, width: 100, textAlign: 'center', padding: 10, border: '1px solid white' }} value={currentDevice && 
            currentDevice.buttonTime && currentDevice.buttonTime.onTime ? currentDevice.buttonTime.onTime : '00:00:00'
            } showSeconds={true} onChange={(event, value) => setOnTime(value)} />
          <br/><br/>
          <span style={{ fontFamily:"montserrat", textAlign:"center", fontWeight: 600, color: '#fff' }}>
            OFF TIME:</span> <TimeField style={{ fontSize: 20, color: 'white', backgroundColor:'black', 
            border: '1px solid white', marginLeft: 20, width: 100, 
              textAlign: 'center', padding: 10  }} value={currentDevice && currentDevice.buttonTime && currentDevice.buttonTime.offTime
               ? currentDevice.buttonTime.offTime : '00:00:00'} showSeconds={true} onChange={(event, value) => setOffTime(value)} />
          
          </div> 

          <br/><br/>

          <Button style={{ color: "#000", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin',
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#40e0d0" , fontSize: 18 , boxShadow: "0px 0px 6px #40e0d0"
                        }}
           onClick={() => {setTime(currentDevice)}}>Set</Button> 

          <br/>
          <Button style={{ color: "#fff", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin', marginTop: 20, 
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#1e1e1e" , fontSize: 18 , boxShadow: "0px 0px 6px #fff"
                        }} onClick={closeModal}>close</Button>
          
          </Modal>
 
        <SockJsClient url={serviceUrl+'/secured/ws-message'} topics={['/topic/message']}
        debug = {true}
        headers = {{
          "Access-Control-Allow-Origin" : "*",
          "Authorization": "Bearer " + (localStorage.getItem("jwt") || ""),
          "Accept" : "*/*"
      }} subscribeHeaders = {{
        "Access-Control-Allow-Origin" : "*",
        "Authorization": "Bearer " + (localStorage.getItem("jwt") || ""),
        "Accept" : "*/*"
    }} 
            onMessage={(msg) => { console.log(msg); 
            
               //history.push('/#/devices/#' + msg.id);
               window.location.reload();
                // devices.forEach(device => {
                //   console.log(device.id);
                //     if(device.id === msg.id){
                //         if(msg.state && msg.state.value){
                //             device.state.value = msg.state.value;
                //         }
                //         //updateScreen();
                //     }
                // });

                //updateScreen();
            
            }}
            ref={ (client) => {  }} />

<Button style={{ variant : "contained", color: "#000", marginTop:40, fontWeight: 600, paddingLeft: 40, 
          fontFamily: 'Cabin',
          paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#40e0d0" , fontSize: 18 , boxShadow: "0px 0px 6px #40e0d0"
          }} onClick={logout}>Log Out</Button>

            { devices.map((device) => (
              
              
                  <Card onClick={() => {openModal(device)}} key={device.id} style={{ 
                    fontFamily: 'Cabin',
                    marginLeft: 20, marginRight: 20, marginTop: 30, borderRadius: '25px',
                    textShadow: device.state.value === "OFF" ? "0px 0px 2px #9E9E9E" : "0px 0px 2px #000",
                    paddingTop: 20, paddingBottom: 20, background : (
                    device.state.value === "OFF" ? "#1e1a1a" : "#40e0d0"
                  ), boxShadow: device.state.value === "OFF" ? "0px 0px 6px #9E9E9E" : "0px 0px 12px #40e0d0" }}>

                    <h2 style={{ fontFamily:"montserrat", marginLeft: 0, marginRight:0, color : (
                    device.state.value === "OFF" ? "#fff" : "#000"
                  ) }}>{device.name}</h2>

                  {device && device.state && device.state.type==='TIMER' && device.buttonTime && <div>

                  <h3 style={{ fontFamily:"montserrat", marginLeft: 0, marginRight:0, color : (
                    device.state.value === "OFF" ? "#fff" : "#fff"
                  ) }}>ON TIME: {device && device.buttonTime && device.buttonTime.onTime}</h3>

                  <h3 style={{ fontFamily:"montserrat", marginLeft: 0, marginRight:0, color : (
                    device.state.value === "OFF" ? "#fff" : "#fff"
                  ) }}>OFF TIME: {device && device.buttonTime && device.buttonTime.offTime}</h3>

                  </div>
                  }
                  

                  {/* <Switch style={{marginTop:20, marginBottom:20, marginLeft:0}}
  checked={device.state.value === "ON"}
  onColor="rgb(175,238,238)"
  readOnly={true}
/> */}
                    </Card>
                    
            ))}

<PulseLoader color={'#40e0d0'} loading={loading} css={override} />
      </div>
      );
  };

export default Devices;