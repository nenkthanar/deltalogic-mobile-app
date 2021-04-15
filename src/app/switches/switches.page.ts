import { Component, OnInit,OnDestroy} from '@angular/core';
import {  AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {  NgZone } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Socket } from 'ngx-socket-io';
import{TOKEN}from '../api/mqtt.service';
@Component({
  selector: 'app-switches',
  templateUrl: './switches.page.html',
  styleUrls: ['./switches.page.scss'],
})
export class SwitchesPage implements OnInit ,OnDestroy  {
    isListening: boolean = false;
    matches: Array<String>;
    set_up="";
    mode = "";
    switch = "";
    read_comm="wait";
    automate:String="wait"
    listened:boolean=false
    public press: number = 0;
    pub_topic = TOKEN[0].data;
    buttons = [{btnName:["button1","button2","button3","button4","button5","button6"]},
               {btnPort:["Relay1","Relay2","Relay3","Relay4","Relay5","Relay6"]},
               {btnState:["btn1off","btn2off","btn3off","btn4off","btn5off","btn6off"]}];
   

    constructor(
    public alertController: AlertController,
    public storage: Storage,
    private socket: Socket,
    public speech: SpeechRecognition, 
    private zone: NgZone,
    private tts: TextToSpeech
    ) {
    this.RunAutomate_listen();
    this.storage.get('app_token').then((val) => {
     this.pub_topic = val;
    });
    this.buttonRCV();
     }
  
     pressEvent(e) {
      this.press++;
    }

  buttonRCV(){
    let sub_topic = TOKEN[0].data + "/button_state";
    this.socket.fromEvent(sub_topic).subscribe(data => {
    if(data == "btn1on"){
      document.getElementById("button1").classList.remove("on")    
      this.buttons[2].btnState[0] = String(data);
    }
    if(data == "btn2on"){
      document.getElementById("button2").classList.remove("on")  
      this.buttons[2].btnState[1] = String(data);  
    }
    if(data == "btn3on"){
      document.getElementById("button3").classList.remove("on")    
      this.buttons[2].btnState[2] = String(data);
    }
    if(data ==  "btn4on"){
      document.getElementById("button4").classList.remove("on")    
      this.buttons[2].btnState[3] = String(data);
    }
    if(data == "btn5on"){
      document.getElementById("button5").classList.remove("on")    
      this.buttons[2].btnState[4] = String(data);
    }
    if(data == "btn6on"){
      document.getElementById("button6").classList.remove("on")  
      this.buttons[2].btnState[5] = String(data);  
    }
    if(data == "btn1off"){
      document.getElementById("button1").classList.add("on")    
      this.buttons[2].btnState[0] = String(data);
    }
    if(data == "btn2off"){
      document.getElementById("button2").classList.add("on")      
      this.buttons[2].btnState[1] = String(data);
    }
    if(data == "btn3off"){
      document.getElementById("button3").classList.add("on")      
      this.buttons[2].btnState[2] = String(data);
    }
    if(data == "btn4off"){
      document.getElementById("button4").classList.add("on")   
      this.buttons[2].btnState[3] = String(data);  
    }
    if(data == "btn5off"){
      document.getElementById("button5").classList.add("on")    
      this.buttons[2].btnState[4] = String(data); 
    }
    if(data == "btn6off"){
      document.getElementById("button6").classList.add("on")     
      this.buttons[2].btnState[5] = String(data);
    }
 
    })
  }

  checkButton(){
    setTimeout(() => {
    this.pub_topic = TOKEN[0].data;
    this.socket.emit(this.pub_topic,"button_state");
    }, 1000);
  }
    
  async presentAlert(str) {
    const alert = await this.alertController.create({
    message: str,
    buttons: ['OK']
    });
    await alert.present();
  
    }

 async presentPrompt(names) {
   if(this.mode =="Setup"){
    var i=0;
    if(names=='button1'){i=0};
    if(names=='button2'){i=1};
    if(names=='button3'){i=2};
    if(names=='button4'){i=3};
    if(names=='button5'){i=4};
    if(names=='button6'){i=5};
    var alert =await this.alertController.create({
    message: names,
    inputs: [
      {
        name: 'name',
        value: this.buttons[0].btnName[i],
        id:'name'
        },
        {
        name: 'port',
        value: this.buttons[1].btnPort[i],
        id:'port'
        }
        ],
        buttons: [
        {
        text: 'Ok',
        role: 'ok',
        handler: data => {
        this.buttons[0].btnName[i] = data.name;
        this.buttons[1].btnPort[i] = data.port;
        this.storage.set("buttons",JSON.stringify(this.buttons));
        this.presentAlert("Data saved");
        }
        },
        {
        text: 'Cancel',
        role: 'Cancel',
        handler: data => {
           
      }
     }
    ]
  });
  await alert.present();
  }
  }

  change_btnum(){
    this.storage.set("switch",this.switch);
  if(this.switch=='4'){
  document.getElementById("main").style.height = "100%";
   document.getElementById("bt5-name").style.display="none"
   document.getElementById("bt6-name").style.display="none"
   document.getElementById("switch5").style.display="none"
   document.getElementById("switch6").style.display="none"
  }
  if(this.switch=='6'){
    document.getElementById("main").style.height = "120%";
    document.getElementById("bt5-name").style.display="block"
    document.getElementById("bt6-name").style.display="block"
    document.getElementById("switch5").style.display="block"
    document.getElementById("switch6").style.display="block"
   }
   }


   Action(str){
    this.pub_topic = TOKEN[0].data;
    var mess;
    if(str == "btn1"){
      mess = JSON.stringify({topic:this.pub_topic,msg:this.pub_topic + this.buttons[2].btnState[0]});
    }
    if(str == "btn2"){
      mess = JSON.stringify({topic:this.pub_topic,msg:this.pub_topic + this.buttons[2].btnState[1]});
    }
    if(str == "btn3"){
      mess = JSON.stringify({topic:this.pub_topic,msg:this.pub_topic + this.buttons[2].btnState[2]});
    }
    if(str == "btn4"){
      mess = JSON.stringify({topic:this.pub_topic,msg:this.pub_topic + this.buttons[2].btnState[3]});
    }
    if(str == "btn5"){
      mess = JSON.stringify({topic:this.pub_topic,msg:this.pub_topic + this.buttons[2].btnState[4]});
    }
    if(str == "btn6"){
      mess = JSON.stringify({topic:this.pub_topic,msg:this.pub_topic + this.buttons[2].btnState[5]});
    }
    this.socket.emit('thanarmq/command',mess);
    console.log(mess);
   }

   setMode(){
    this.storage.set("mode",this.mode);
    this.check_mode();
   }

   check_mode(){
     var bt= document.getElementById("play");
     var bt1=document.getElementById("set");
    if(this.mode=="Run"){
     bt .style.display="block";
     bt1.style.display="none";
    }
    else if (this.mode=="Setup"){
     bt.style.display="none";
     bt1 .style.display="block";
    }
    else if(this.mode=="voice"){
    }
    this.change_btnum();
    }
//================================================
  textToSpeech(text) {
   this.tts.speak(text)
   this.tts.speak({
   text: text,
   locale: 'th-GB',
   rate: 0.75
  })
  
.then(() => console.log('Success'))
.catch((reason: any) => console.log(reason));
}

async hasPermission():Promise<boolean> {
  try {
    const permission = await this.speech.hasPermission();
    console.log(permission);

    return permission;
  } catch(e) {
    console.log(e);
  }
}

async getPermission():Promise<void> {
  try {
    this.speech.requestPermission();
  } catch(e) {
    console.log(e);
  }
}

listen(): void {
  let _this = this;
  this.listened=true;
  this.speech.startListening()
    .subscribe(matches => {
      _this.zone.run(() => {
        _this.matches = matches;
        this.RunVoiceComm();
      })
    }, error =>  this.listen());
    this.listened=false;
}

automate_listen(){
    if(this.automate=="wait"){
    this.automate="listened";
    console.log("listening");
    }else{
    this.automate="wait"
    console.log("wait");
    }
    }

RunAutomate_listen(){
setInterval( ()=>{
  if(this.automate=="listened" && this.listened==false){
  this.RunVoiceComm();
  this.listen();
  }
  },2000);
  }

RunVoiceComm(){

   }

toggleListenMode():void {
   this.isListening = this.isListening ? false : true;
   console.log('listening mode is now : ' + this.isListening);
   }

  //=======================================================
    ngOnInit() {
    this.storage.get("buttons").then(val=>{
      if(val != null){
      this.buttons = JSON.parse(val);
      }
    });
    this.storage.get("mode").then(val=>{
      if(val != null){
      this.mode = val;
      this.check_mode();
      }
    });
    this.storage.get("switch").then(val=>{
      if(val != null){
      this.switch = val;
      }
      this.change_btnum();
    })
    this.change_btnum();
    this.getPermission();

    }

    ngOnDestroy(){
    this.storage.set("page","switches");
    console.log("save configuration");
    }
    }
   
