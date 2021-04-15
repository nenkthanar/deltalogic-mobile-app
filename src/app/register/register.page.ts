import { Component, OnInit } from '@angular/core';
//import { Socket } from 'ngx-socket-io';
import {  AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user_log=[{
    'name':'',
    'email':'',
    'password':''
     }];
email='';
name='';
password='';
confirmpassword='';
  constructor(
    public alertController: AlertController,
    public storage: Storage,
    private platform: Platform,
    private router: Router
  ) { }

    readConfig(){
      this.storage.get("config").then(data=>{
        if(data.length>1){
        let obj=JSON.stringify(data);
        }
       });
    }
  getStorage="";
  
  save_account(){
  if(this.name!=''&&this.password!=''&&this.email!=''){
  if(this.password!=this.confirmpassword){
  this.presentAlert("รหัสผ่านไม่ตรงกับการยืนยัน");
  return;
  }
  this.user_log[0].name = this.name;
  this.user_log[0].email = this.email;
  this.user_log[0].password = this.password;
  this.storage.set('user_data',JSON.stringify(this.user_log));
  this.storage.set("login",'NO');
  this.presentAlert('Create account sucess');
  this.router.navigateByUrl('/login');
  }else{
  this.presentAlert('Field cannot be blank');
  }
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
    });
    });
  }

}
