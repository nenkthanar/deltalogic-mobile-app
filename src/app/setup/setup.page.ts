import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Platform } from '@ionic/angular';
import {DEV_LIST, SOCKET_TOPIC} from '../api/mqtt.service'
import {  AlertController} from '@ionic/angular';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  dev = DEV_LIST;
  app_token = "";
        
  constructor(
    public storage: Storage,
    public alertController: AlertController,
    ) {

    }
    
    async generate() {
      var alert =await this.alertController.create({
        message: 'Edit setting',
      inputs: [
        {
          name: 'Token',
          value: this.makeid(18),
          id:'name'
          }
          ],
          buttons: [
           {
           text: 'Ok',
           role: 'ok',
           handler: data => {
           console.log(data);
           this.app_token = data.Token;
           this.storage.set('app_token',data.Token);
           }
          },
          {
            text: 'Send',
            role: 'ok',
            handler: data => {
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
      
    
    makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
        }

    ngOnInit() {
        this.app_token = SOCKET_TOPIC[1].device;
     }
    }
