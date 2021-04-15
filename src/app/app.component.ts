import { Component } from '@angular/core';
import {  AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Router } from "@angular/router";
import {SOCKET_TOPIC} from '../app/api/mqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
  })

    export class AppComponent {
      dev_list = [];
    public appPages = [
    {
      title: 'Main',
      url: '/home',
      icon: 'browsers'
    },
    {
      title: 'Setting',
      url: '/setup',
      icon: 'settings'
    },
    {
      title: 'Switches',
      url: '/switches',
      icon: 'switch'
    } ,/*
    {
      title: 'Voice',
      url: '/voicecommand',
      icon: 'microphone'
    } ,*/
    {
      title: 'Sensors',
      url: '/graph',
      icon: 'thermometer'
    } ,
    {
      title: 'Controler',
      url: '/controler',
      icon: 'folder-open'
    } ,
    {
      title: 'Logout',
      url: '/logout',
      icon: 'power'
    }
    ,
    {
      title: 'contact us',
      url: '/contact',
      icon: 'people'
    }
  ];
   par=[];

   public _mqttClient: any;

    TOPIC = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage: Storage,
    private router: Router,
    public alertController: AlertController,
  ) {
    this.initializeApp();
  }

  async presentAlert(str) {
    const alert = await this.alertController.create({
    message: str,
    buttons: ['OK']
    });
    await alert.present();
    }
   ngOnInit() {
    this.storage.get('app_token').then((res) => {
    SOCKET_TOPIC[1].device = res;
    })
    }

     initializeApp() {
     this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get("config").then(data=>{
      if(data != null){
      let obj=JSON.stringify(data);
      this.par =JSON.parse(obj);
      }
      }); 
      
      this.storage.get("login")
      .then( data => {
        if(data=='OK'){
        document.getElementById("list").style.display="block";
        this.storage.get("page").then(val=>{
          if(val == "home"){
            this.router.navigateByUrl('/home');
            return;
          }else if(val == "setup" ){
            this.router.navigateByUrl('/setup');
            return;
          }else if(val == "switch" ){
            this.router.navigateByUrl('/switches');
            return;
          }
          else if(val == "voicecommand" ){
            this.router.navigateByUrl('/voicecommand');
            return;
          }
          else if(val == "graph" ){
            this.router.navigateByUrl('/graph');
            return;
          }
          else if(val == "dbmanager" ){
            this.router.navigateByUrl('/dbmanager');
            return;
          }
          else if(val == "logout" ){
            this.router.navigateByUrl('/logs');
            return;
          }
          else if(val == "logout" ){
            this.router.navigateByUrl('/logs');
            return;
          }
        })
        }else{
          this.router.navigateByUrl('/login');
        }
        });
    });
  }
}
