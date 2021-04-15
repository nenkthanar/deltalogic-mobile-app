
import { MQTTService } from 'ionic-mqtt';
export const mqttservice = new MQTTService;

export const MQTT_MSG = [
    {
    msg:"Waiting",
    connection:"Server false!"
    }
    ]

export const TOKEN =[{
    data:"T3JM3RlPjcSpCpc4azyp"
    }]

export const DEVICE =[{
    name:"Not found"
    }]

export var DEV_LIST = [
    {Name:""},
    {Token:""}
    ];

export const DEV_DATA = [{
    "Name":"Name",
    "Token":"Token"
    }]

export const command = [
    {
    connection:TOKEN[0].data,
    amt:TOKEN[0].data + "amt",
    dht:TOKEN[0].data+"dht",
    analog1:TOKEN[0].data+"Analog1",
    analog2:TOKEN[0].data+"Analog2",
    analog3:TOKEN[0].data+"Analog3",
    analog4:TOKEN[0].data+"Analog4",
    analog5:TOKEN[0].data+"Analog5",
    analog6:TOKEN[0].data+"Analog6"
    }
    ]

export const PUB_TOPIC = [{name:"",data:TOKEN[0].data + "/dev"}];

export const SUB_TOPIC = TOKEN[0].data + "/app";

export const CONTROLLER = [{
      device:"Analog",
      sensor:"",
      token:"",
      operator:[">","<",">=","<=","=="],
      min:0,
      max:0,
      command:"",
      port1:"",
      port2:""
      }]

export const SOCKET_TOPIC = [{send:"thanarmq/server"},
                             {device:""}]

