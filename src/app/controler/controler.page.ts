import { Component, Input, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { Router } from "@angular/router";
import {CONTROLLER,mqttservice} from '../api/mqtt.service';
import { Storage } from '@ionic/storage';
import {Socket} from 'ngx-socket-io';
import {TOKEN} from '../api/mqtt.service';
@Component({
  selector: 'app-controler',
  templateUrl: './controler.page.html',
  styleUrls: ['./controler.page.scss'],
})
export class ControlerPage implements OnInit {
  controller = CONTROLLER;
  mqttService = mqttservice;
  program = [];
  operator = ["Begin","If","Then","Elf",">","<",">=","<=","on","off","end"];
  variables = [];
  progOutputs =[];
  alertTitle = 'Select Operator';
  progInputs = [];

  constructor( private router: Router,
    private alertController:AlertController,
    private storage:Storage,
    private socket:Socket
    ) 
    { 
      this.progInputs = this.createInputs();
      this.progOutputs = this.createOutputs();
    }
    
  updateProgram(){
        let pub_topic = TOKEN[0].data +"/program";
        let mess;
        for(let i =0;i<this.program.length;i++){
         mess = JSON.stringify({topic:pub_topic,msg:JSON.stringify(this.program[i])});
        this.socket.emit('thanarmq/command',mess);
        }
        console.log(mess);
        }

  createInputs() {
      const theNewInputs = [];
      for (let i = 0; i < this.operator.length; i++) {
        theNewInputs.push(
        {
        label: this.operator[i],
        value: this.operator[i],
        type: 'radio',
        checked: false
        }
        );
      }
      return theNewInputs;
    }

    createOutputs() {
      const theNewOutputs = [];
      for (let i = 1; i < 6; i++) {
        theNewOutputs.push(
          {
          label: "Out"+i ,
          value: "Out"+i,
          type: 'radio',
          checked: false
          }
        );
      }
      return theNewOutputs;
    }
  
    async creatVar(i) {
      const alert = await this.alertController.create({
        header: 'Create Variable',
        inputs: [      {
          name: 'name',
          value: "name",
          id:'name'
          },
          {
          name: 'value',
          value: "value",
          id:'variable'
          }],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              this.program[i] = data;
              console.log(this.program);
            }
          }
        ]
      });
  
      await alert.present();
    }
  
    async editOpt(i) {
      const alert = await this.alertController.create({
        header: this.alertTitle,
        inputs: this.progInputs,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
            let opt = {name:data}
            this.program[i] = opt;
            console.log(this.program);
            }
          }
        ]
      });
  
      await alert.present();
    }

    async editOutput(i) {
      const alert = await this.alertController.create({
        header: "Edit output",
        inputs: this.progOutputs,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              let opt = {name:data}
              this.program[i] = opt;
              console.log(this.program);
            }
          }
        ]
      });
  
      await alert.present();
    }

    async selectOpt(i) {
      const alert = await this.alertController.create({
        header: "Select Type",
        buttons: [
          {
            text: 'Operator',
            handler: () => {
              this.editOpt(i);
            }
          }, {
            text: 'Variable',
            handler: (data) => {
             this.creatVar(i);
            }
          }, {
            text: 'Output',
            handler: (data) => {
             this.editOutput(i);
            }
          }, {
            text: 'Notifications',
            handler: (data) => {
             this.creatVar(i);
            }
          }
        ]
      });
  
      await alert.present();
    }

  goGraph(){
    this.router.navigateByUrl('/graph');
  }
  async addNew() {
    var alert =await this.alertController.create({
     message: 'Creating new device',
    inputs: [
      {
        name: 'name',
        value: "name",
        id:'name'
        },
        {
        name: 'value',
        value: "value",
        id:'value'
        }
        ],
        buttons: [
         {
         text: 'Ok',
         role: 'ok',
         handler: data => {
         this.program.push(data);
         this.storage.set('program',JSON.stringify(this.program));
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
     async setting(i) {
      var alert =await this.alertController.create({
        message: 'Edit setting',
      inputs: [
        {
          name: 'Name',
          value: this.program[i].Name,
          id:'name'
          },
          {
          name: 'Operator',
          value: 'operator',
          id:'operator'
          }
          ],
          buttons: [
           {
           text: 'Ok',
           role: 'ok',
           handler: data => {
           console.log(data);
           this.storage.set("program",JSON.stringify(this.program));
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
       async deleteProg(i) {
        var alert = await this.alertController.create({
          message: 'Deleting device',
            buttons: [
             {
             text: 'Ok',
             role: 'ok',
             handler: data => {
             this.program.splice(i,1);
             this.storage.set("program",JSON.stringify(this.program));
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

      async presentAlert(str) {
        const alert = await this.alertController.create({
        message: str,
        buttons: ['OK']
        });
      
        await alert.present();
        }

    async saveConfirm() {
      let alert = await this.alertController.create({
        message: 'Update program to hardware',
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
           console.log("Save");
           this.updateProgram();
            }
          }
        ]
      });
      await alert.present();
      }
    

       ngOnInit() {
         this.storage.get('program').then(data =>{
        if(data != null){
          this.program = JSON.parse(data);
        }
         });
      }

}
