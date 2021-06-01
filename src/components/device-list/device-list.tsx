import axios from 'axios';
import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
//import SockJsClient from 'react-stomp';
// import * as SockJS from 'sockjs-client';

const client = new W3CWebSocket('ws://turquoise-burglar-mqtt.herokuapp.com/ws-message');

const Devices = () => {   

    client.onopen = () => {
        console.log('WebSocket Client Connected');
       };

       client.onmessage = (message) => {
        console.log(message);
      };
    
    const [devices, setDevices] = useState([
        {friendlyId: "", name:"", state: "", controlStatus: "" }
    ]);

    useEffect(() => {

        let username = localStorage.getItem("username") || "";

        

        axios.post("https://turquoise-burglar-mqtt.herokuapp.com/getDevices",
        {"username":username})
        .then((value) => {
            if(value.data.status === "FAILURE"){
                console.error(JSON.stringify(value));
            } else {
                setDevices(value.data.devices);
            }
        })
    }, []);

    return (
    <div>
            { devices.map((device) => (
                <div key={device.friendlyId}>
                    <h1>{device.name}</h1>
                    <h2>{device.state}</h2>
                    <h2>{device.controlStatus}</h2>
                    <hr />
                </div>
            ))}
      </div>
      );
  };

export default Devices;