import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  getStorage="";
 name='';
 password='';

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    public storage:Storage,
    private platform: Platform
  ) { }


  check_user(){
    this.platform.ready().then(() => {
   this.storage.get('user_data')
   .then( data => {
  let json_decode=JSON.parse(data);
  if(json_decode[0].name==this.name&&json_decode[0].password==this.password){
  this.storage.set("login",'OK');
  this.presentAlert("Success login");
  this.router.navigateByUrl('/home');
  }else{
  this.presentAlert("Login false!");
  }
   });
   });
   }
  async presentAlert(str) {
  const alert = await this.alertController.create({
  message: str,
  buttons: ['OK']
  });

  await alert.present();
  }
  ngOnInit() {
  this.platform.ready().then(() => {
  this.storage.get('user_data')
  .then( data => {
   this.getStorage=JSON.stringify(data);
    console.log(data);
     });
     });
  }
}
