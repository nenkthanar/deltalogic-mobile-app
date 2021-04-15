import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router } from "@angular/router";
import { AlertController, MenuController,Platform} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { SOCKET_TOPIC,TOKEN} from '../api/mqtt.service';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  })

export class HomePage {
  
  conn_count = 0;
  dev_list = [];
  db: SQLiteObject = null;
  username='';
  getStorage="";
  db_name="";
  select_name="";
  show_project="";
  remain = "";
  start_day = 0;

  repeat:boolean=true;
  public alertShown:boolean = false;
  new_project=[];
  sub_topic = "";
  user_data =[{name:"",email:"",password:""}];
  constructor(
        private socket: Socket,
        private sqlite: SQLite,
        public alertController: AlertController,
        public storage: Storage,
        private router: Router,
        private emailComposer: EmailComposer,
        public navCtrl: NavController,
        private menu:MenuController,
        private localNotifications: LocalNotifications,
        private platform:Platform,
        public nativeAudio:NativeAudio,
        private backgroundMode:BackgroundMode
        ) {
        this.serverRCV();
        this.storage.get("dev_list").then((val)=>{
          if(val != null){
            this.dev_list = JSON.parse(val);
            for(var i =0;i<this.dev_list.length;i++){
              this.deviceRCV(this.dev_list[i].Token);
              this.alarmRCV(this.dev_list[i].Token);
            }
            }
            })  

          this.storage.get('user_data').then(val=>{
          this.user_data = JSON.parse(val);
          })

          this.platform.ready().then(res=>{
            this.localNotifications.on('click').subscribe(res=>{
           this.presentAlert(res.mydata);
           this.playSound();
            })
            this.localNotifications.on('trigger').subscribe(res=>{
           this.presentAlert(res.mydata);
           this.playSound();
            })
          })
        }

        playSound(){
          this.nativeAudio.preloadSimple('audio1', '../../assets/sound/notify.mp3').then((msg)=>{
            console.log("message: " + msg);
          }, (error)=>{
            console.log("error: " + error);
          });
          this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
        }
      

      makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
          }

      checkServer =  setInterval(() => { 
          let data = JSON.stringify({topic:SOCKET_TOPIC[0].send,msg:"OK"})
          this.socket.emit('thanarmq/server',data);
          }, 2000);
        
      serverRCV(){
          this.socket.fromEvent(SOCKET_TOPIC[0].send).subscribe(data => {
          document.getElementById("server").style.display="block";  
          });
          }

      checkDevice = setInterval(() => {
          for(var i=0;i<this.dev_list.length;i++){
          let data = JSON.stringify({topic:this.dev_list[i].Token,msg:this.dev_list[i].Token})
          this.socket.emit('thanarmq/command',data);
          //console.log(this.dev_list[0].Token);
          }
          },2000)

      deviceRCV(sub_topic){
        this.socket.fromEvent(sub_topic).subscribe(data => {
        try {
          let id = String(data);
          document.getElementById(id).style.color ="green";
          document.getElementById(id).innerText = "ONLINE"
          } catch (error) {
          }
          });
          }

      alarmRCV(sub_topic){
        try {
          const subTopic = sub_topic + "/alarm";
          this.socket.fromEvent(subTopic).subscribe(res => {
           this.scheduleNotification(res);
          });
          } catch (error) {
          }
          }
     
     async setting(i) {
      var alert =await this.alertController.create({
        message: 'Edit setting',
      inputs: [
        {
          name: 'Name',
          value: this.dev_list[i].Name,
          id:'name'
          },
          {
          name: 'Token',
          value: this.dev_list[i].Token,
          id:'token'
          }
          ],
          buttons: [
           {
           text: 'Ok',
           role: 'ok',
           handler: data => {
           console.log(data);
           this.dev_list[i] = data
           this.storage.set("dev_list",JSON.stringify(this.dev_list));
           this.deviceRCV(data.Token);
           this.presentAlert("Data saved");
           }
          },
          {
            text: 'Send',
            role: 'ok',
            handler: data => {
            this.send_mail(i);
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
    
   async addNew() {
   var alert =await this.alertController.create({
    message: 'Creating new device',
   inputs: [
     {
       name: 'Name',
       value: "Name",
       id:'name'
       },
       {
       name: 'Token',
       value: this.makeid(20),
       id:'token'
       }
       ],
       buttons: [
        {
        text: 'Ok',
        role: 'ok',
        handler: data => {
        console.log(data);
        this.dev_list.push(data);
        this.storage.set("dev_list",JSON.stringify(this.dev_list));
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

 async deleteDev(i) {
  var alert = await this.alertController.create({
    message: 'Deleting device',
      buttons: [
       {
       text: 'Ok',
       role: 'ok',
       handler: data => {
       this.dev_list.splice(i,1);
       this.presentAlert("Success delete");
       this.storage.set("dev_list",JSON.stringify(this.dev_list));
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

selectDev(i){
  console.log("dev",i)
  TOKEN[0].data = this.dev_list[i].Token;
  console.log(TOKEN[0].data);
  clearInterval(this.checkDevice);
  this.menu.open();
}

loadDevlist(){
  this.storage.get("dev_list").then((val)=>{
    console.log(val);
    if(val != null){
      this.dev_list = JSON.parse(val);
      }
      })  
      }
  
     delete_project(num){
     this.storage.get("project").then(data=>{
     });
     this.storage.set("project","");
     }
  
    go_project(){
    if(this.select_name=="1 เปิด/ปิดไฟฟ้า"){
    this.router.navigateByUrl('/switch');
    }
    }
  
    select_ID(num){
    this.select_name=num;
    this.go_project();
    }
    go_login(){
    this.router.navigateByUrl('/login');
    }
  
    go_register(){
    this.router.navigateByUrl('/register');
    }
      create_db(name){
        if(this.db_name!=""){
      this.sqlite.create({
      name: 'data.db',
      location: 'default'
      })
  
      .then((db: SQLiteObject) => {
       db.executeSql('create table '+name+'(name VARCHAR(32))', [])
     .then(() => this.presentAlert('Excute SQL'))
      .catch(e =>  this.presentAlert(e));
      })
      .catch(e => this.presentAlert(e));
      }else{
        this.presentAlert("Data base name cannot be blank !")
      }
    }
  
    async presentAlert(str) {
    const alert = await this.alertController.create({
    message: str,
    buttons: ['OK']
    });
  
    await alert.present();
    }

    async presentConfirm() {
      let alert = await this.alertController.create({
        message: 'ส่งระหัสไปที่อีเมลของคุณ',
        buttons: [
          {
            text: 'ยกเลิก',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'ตกลง',
            role:'ok',
            handler: () => {

            }
          }
        ]
      });
        await alert.present();
        this.router.navigateByUrl['/switches'];
      }
    exit_program(){
      this.backgroundOn();
      navigator['app'].exitApp();
      }
   async exitConfirm() {
      let alert = await this.alertController.create({
        message: 'Are you sure to exit',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'OK',
            role:'ok',
            handler: () => {
            this.exit_program();
            }
          }
        ]
      });
      await alert.present();
      this.router.navigateByUrl['/switches'];
      }

    send_mail(i){
      let email_acc="thanarnopeq@gmail.com";
      this.emailComposer.addAlias('gmail', 'com.google.android.gm');
      this.emailComposer.open({
      app:this.user_data[0].email,
      to: email_acc,
      subject: 'Your authentication Token ',
      body: 'Hello from deltalogic team this is your secret auth for device connection   : '+ this.dev_list[i].Token,
      isHtml: true
      });
      this.presentAlert("Email is already send to your mail box");
      }

    getTime(){
      this.storage.get('start_day').then(res=>{
        if(res != null){
        this.start_day = res;
        }
      })
      setTimeout(() => {
        let d = new Date();
        let y = d.getFullYear();
        let m = d.getMonth();
        let ds = d.getDate();
        
        let current = y + m + ds;
        this.storage.get('start').then(res=>{
          if(res == 'OK'){
            console.log("Already start");
            return;
          }else{
            this.storage.set('start_day',current + 30 );
            this.storage.set('start','OK' );
          }
        })
        this.remain = String(this.start_day - current);
        document.getElementById("remain").innerText = this.remain + " days";
        console.log("get time : ",this.start_day,':',current);
        },2000)
      }

     ngOnInit() {
       this.loadDevlist();
       this.checkServer;
       this.checkDevice;
       document.getElementById("server").style.display="none";  
       this.getTime();
      }

      ionViewDidLoad(){  
      this.storage.set("page","home");
      }

      ionOnDestroy(){
        clearInterval(this.checkServer);
        clearInterval(this.checkDevice);
      }
      backgroundOn(){
        this.backgroundMode.enable();
        this.backgroundMode.on("activate").subscribe(()=>{
          console.log("Running background")
        });
      }
    
      scheduleNotification(msg){
        this.localNotifications.schedule({
          id: 1,
          text: msg,
          sound:  '../../assets/sound/notify.mp3',
          trigger:{in:5,unit:ELocalNotificationTriggerUnit.SECOND},
          data: { mydata:'test' },
          foreground:false
        });
      }
      }
