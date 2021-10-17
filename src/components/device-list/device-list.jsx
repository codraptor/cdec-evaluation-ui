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

import TimeField from 'react-simple-timefield';



// import * as SockJS from 'sockjs-client';

//const client = new W3CWebSocket('ws://turquoise-burglar-mqtt.herokuapp.com/ws-message');

const customStyles = {
    content : {
      top                   : '50%',
      bottom                : 'auto',
      transform             : 'translate(0%, -50%)',
      textAlign             : 'center'
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
  padding-top:300px;
  width: 100%;
  height: 100%;
  z-index: 9999;
    background:rgba(255, 255, 255, 0.6);
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
    subtitle.style.color = '#f00';
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

          <Button style={{ variant : "contained",  color: "#000", fontSize: 20,
        
           paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10, background : "#40e0d0" }} 
           onClick={() => {switchDevice(currentDevice)}}>{currentDevice && currentDevice.state.value==='OFF' ? 'SWITCH ON' : 'SWITCH OFF'}</Button> 
      
          <h2 style={{ fontFamily:"montserrat", textAlign:"center", marginTop:50, color: "000" }} ref={_subtitle => (subtitle = _subtitle)}>Set Time</h2>

          <div>
          
          <span style={{ fontFamily:"montserrat", textAlign:"center", fontWeight: 600, color: "000" }}>
            ON TIME:</span> 
            <TimeField style={{ fontSize: 20, marginLeft: 20, width: 100, textAlign: 'center', padding: 10 }} value={currentDevice && 
            currentDevice.buttonTime && currentDevice.buttonTime.onTime ? currentDevice.buttonTime.onTime : '00:00:00'
            } showSeconds={true} onChange={(event, value) => setOnTime(value)} />
          <br/><br/>
          <span style={{ fontFamily:"montserrat", textAlign:"center", fontWeight: 600, color: "000" }}>
            OFF TIME:</span> <TimeField style={{ fontSize: 20, marginLeft: 20, width: 100, 
              textAlign: 'center', padding: 10  }} value={currentDevice && currentDevice.buttonTime && currentDevice.buttonTime.offTime
               ? currentDevice.buttonTime.offTime : '00:00:00'} showSeconds={true} onChange={(event, value) => setOffTime(value)} />
          
          </div> 

          <br/><br/>

          <Button style={{ variant : "contained",  color: "#000", fontSize: 20,
        
           paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10, background : "#40e0d0" }} 
           onClick={() => {setTime(currentDevice)}}>Set</Button> 

          <br/>
          <Button style={{ textAlign:"center", variant : "contained",  color: "#fff", marginTop:20, marginBottom:30,
           paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#f33" , fontSize: 20 }} onClick={closeModal}>close</Button>
          
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

<Button style={{ variant : "contained",  color: "#fff", marginTop:40, paddingLeft: 40, 
paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#444" , fontSize: 20 }} onClick={logout}>Log Out</Button>

            { devices.map((device) => (
              
              
                  <Card onClick={() => {openModal(device)}} key={device.id} style={{ 
                    marginLeft: 20, marginRight: 20, marginTop: 30, borderRadius: '25px',
                    paddingTop: 20, paddingBottom: 20, background : (
                    device.state.value === "OFF" ? "#1a1a1a" : "#7393B3"
                  ), boxShadow: "0px 0px 6px #9E9E9E" }}>

                    <h2 style={{ fontFamily:"montserrat", marginLeft: 0, marginRight:0, color : (
                    device.state.value === "OFF" ? "#fff" : "#fff"
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

<PulseLoader color={'#000'} loading={loading} css={override} />
      </div>
      );
  };

export default Devices;