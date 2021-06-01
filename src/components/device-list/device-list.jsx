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


    // client.onopen = () => {
    //     console.log('WebSocket Client Connected');
    //    };

    //    client.onmessage = (message) => {
    //     console.log(message);
    //   };

  const [modalIsOpen,setIsOpen] = React.useState(false);
  const [currentDevice, setDevice] = React.useState( {friendlyId: "", name:"", state: "", controlStatus: "" });

  var subtitle;

  function openModal(device) {
    setDevice(device);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setDevice(null);
    setIsOpen(false);
  }
    
    const [devices, setDevices] = useState([
        {friendlyId: "", name:"", state: "", controlStatus: "" }
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

    function updateControlStatus(){

      let username = localStorage.getItem("username") || "";

      let axiosConfig = {
        headers: {
            "Authorization": "Bearer " + (localStorage.getItem("jwt") || "")
        }
      };

      console.log("status to be switched: "+ currentDevice.controlStatus && currentDevice.controlStatus === "ON"? "OFF" : "ON");

        axios.post(serviceUrl + "/switchControl",
        {"username":username,
      "status": currentDevice.controlStatus && currentDevice.controlStatus === "ON"? "OFF" : "ON",
    "deviceId":currentDevice.friendlyId}, axiosConfig)
        .then((value) => {
            console.log(value);
            //window.location.reload();

            // let copy = JSON.parse(JSON.stringify(currentDevice));
            // copy.controlStatus = copy.controlStatus && copy.controlStatus === "ON"? "OFF" : "ON";
            // setDevice(copy);
             closeModal();
        })
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
    
          axios.get(serviceUrl + "/validateToken",axiosConfig).then((value)=> {
            if(value.data === "SUCCESS"){
                  
            } else {
              localStorage.removeItem("jwt");
              history.push('/');
            }
            console.log(value);
          });
    
        } else {
          history.push('/');
        }

        axios.post(serviceUrl + "/getDevices",
        {"username":username}, axiosConfig)
        .then((value) => {
            if(value.data.status === "FAILURE"){
                console.error(JSON.stringify(value));
            } else {
                setDevices(value.data.devices);
            }
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

      
          <h2 style={{ fontFamily:"montserrat", textAlign:"center", marginTop:50 }} ref={_subtitle => (subtitle = _subtitle)}>Do you want to <br/> switch the device <br/>{ currentDevice && currentDevice.controlStatus === "ON"? "OFF": "ON" }?</h2>
          <Button style={{ variant : "contained",  color: "#000", fontSize: 20,
        
           paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10, background : "#40e0d0" }} 
           onClick={updateControlStatus}>Yes</Button> 

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
            
              history.push('/#/devices');
              //window.location.reload();
                devices.forEach(device => {
                    if(device.friendlyId === msg.friendlyId){
                        // if(msg.state){
                        //     device.state = msg.state;
                        // }
                        // if(msg.controlStatus){
                        //     device.controlStatus = msg.controlStatus;
                        // }
                        updateScreen();
                    }
                });

                updateScreen();
            
            }}
            ref={ (client) => {  }} />

<Button style={{ variant : "contained",  color: "#fff", marginTop:40, paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#444" , fontSize: 20 }} onClick={logout}>Log Out</Button>

            { devices.map((device) => (
              
              
                  <Card onClick={() => {openModal(device)}} key={device.friendlyId} style={{ 
                    marginLeft: 20, marginRight: 20, marginTop: 40,
                    paddingTop: 20, paddingBottom: 20, background : (
                    device.controlStatus === "OFF" ? "#ddd" : device.state === "NOT_SAFE" ? "#f33" : "#40e0d0"
                  )  }}>
                    <h1 style={{ fontFamily:"montserrat", color : (
                    device.controlStatus === "OFF" ? "#000" : device.state === "NOT_SAFE" ? "#fff" : "#000"
                  ) }}>{device.name}</h1>
                    <hr style={{  border : "1px solid" + (
                    device.controlStatus === "OFF" ? "#000" : device.state === "NOT_SAFE" ? "#fff" : "#000"
                  ) }}/>
                    <h2 style={{ fontFamily:"montserrat", color : (
                    device.controlStatus === "OFF" ? "#000" : device.state === "NOT_SAFE" ? "#fff" : "#000"
                  ) }}>{device.location}</h2>
                    <h2 style={{ fontFamily:"montserrat", color : (
                    device.controlStatus === "OFF" ? "#000" : device.state === "NOT_SAFE" ? "#fff" : "#000"
                  ) }}>{
                    device.controlStatus === "OFF" ? "" :
                    device.state === "NOT_SAFE" ? "NOT SAFE" : "SAFE"}</h2>
                    <h2 style={{ fontFamily:"montserrat", color : (
                    device.controlStatus === "OFF" ? "#000" : device.state === "NOT_SAFE" ? "#fff" : "#000"
                  ) }}>{device.controlStatus}</h2>
                    </Card>
                    
            ))}
      </div>
      );
  };

export default Devices;