import { Component, OnInit } from '@angular/core';
import {  AlertController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private alertController:AlertController,
    private storage:Storage
  ) { }
  exit_program(){
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
          this.storage.set('login',"false");
          this.exit_program();
          }
        }
      ]
    });
    await alert.present();
    }

  ngOnInit() {
    this.exitConfirm();
  }

}
