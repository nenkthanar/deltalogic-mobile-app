import { Component, OnInit,OnDestroy} from '@angular/core';
import {  AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {CONTROLLER,MQTT_MSG,PUB_TOPIC, TOKEN} from '../api/mqtt.service';
import { Router } from "@angular/router";
import { Socket } from 'ngx-socket-io';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.page.html',
  styleUrls: ['./graph.page.scss'],
})
export class GraphPage implements OnInit {
  sensor = ["Analog1"];
  mode = ["Monitor"];
  page:String="";
  isAndroid = true;
  lineChart: any;
  databaseObj: SQLiteObject; // Database instance object
  set_max = false;
  pub_topic = TOKEN[0].data;
  sub_topic = TOKEN[0].data;
  time_val ="";
  temp_val ="";
  humid_val="";
  row_data: any = [];        // Table rows
  readonly database_name:string = "data.db"; // DB name
  readonly table_name:string = "environment"; // Table name
  sensor1 ="";
  dev =[{
     name:"",
     min:0,
     max:0
  }]
  constructor(
    public alertController: AlertController,
    public storage: Storage,
    private sqlite: SQLite,
    private localNotifications: LocalNotifications,
    private router: Router,
    private socket: Socket,
    private platform: Platform,
    private backgroundMode:BackgroundMode
    ) { 

    this.sensorRCV();

    }

  drawChart(){
   this.lineChart = document.getElementById('myChart');
   this.lineChart = new Chart(this.lineChart, {
      type: 'line',
      data: {
          labels: [""],
          datasets: [
              {
                  label: "Sensor",
                  fill: false,
                  lineTension: 0.2,
                  backgroundColor: " rgba(86, 16, 101, 0.78)",
                  borderWidth: 1,
                  borderColor: " rgb(39, 243, 243 )",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: " rgba(86, 16, 101, 0.78)",
                  pointHoverBorderColor: " rgba(86, 16, 101, 0.78)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 0,
                  pointHitRadius: 10,
                  data: [],
                  spanGaps: false,
              },
              {
                label: "Min",
                fill: false,
                lineTension: 1,
                backgroundColor: "rgb(255, 51, 0)",
                borderWidth:0.5,
                borderColor: "rgb(36, 239, 239)",
                borderCapStyle: 'butt',
                borderDash: [10,5],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderWidth: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(255, 51, 0)",
                pointHoverBorderColor: "rgb(5, 59, 250)",
                pointHoverBorderWidth: 0.5,
                pointRadius: 0,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
            }
            ,
              {
                label: "Max",
                fill: false,
                lineTension: 1,
                backgroundColor: "rgb(255, 51, 0)",
                borderWidth:0.5,
                borderColor: "rgb(239, 36, 36)",
                borderCapStyle: 'butt',
                borderDash: [10,5],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderWidth: 0.3,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(255, 51, 0)",
                pointHoverBorderColor: "rgb(255, 51, 0)",
                pointHoverBorderWidth: 0.5,
                pointRadius: 0,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
            }
          ]
      },   
       options: {
        legend: {
          display: false,
            labels: {
                fontColor: 'white'
            }
        },
        scales: {
            yAxes: [{      
               gridLines: {
               color: "rgba(0, 0, 0, 0)",
                  },             
                ticks: {
                  fontColor:'white',
                  min: 0, 
                  beginAtZero: true,          
                }
            }],
            xAxes: [{      
              gridLines: {
              color: "rgba(0, 0, 0, 0)",
                 },             
               ticks: {
                 fontColor:'white',
                 min: 0, 
                 beginAtZero: true,
                        
               }
           }]
        }
     }
     });
     }

     addData(chart, label, data,data1,data2) {
      chart.data.labels.push(label);
      chart.data.datasets[0].data.push(data);
      chart.data.datasets[1].data.push(data1);
      chart.data.datasets[2].data.push(data2);
      chart.update();
      }

      removeChartData(chart){
        if(chart.data.datasets[0].data.length > 60){
        chart.data.labels.splice(0,1);
        chart.data.datasets[0].data.splice(0,1);
        chart.data.datasets[1].data.splice(0,1);
        chart.data.datasets[2].data.splice(0,1);
        chart.update();
        }
        }
        setMode(){
        this.storage.set("mode",this.mode[0])
        console.log("Set mode");
        }
        checkMode(){
          if(this.mode[0] == "monitor"){
           document.getElementById("play").style.display = "block"
           document.getElementById("set").style.display = "none"
          }else{
            document.getElementById("play").style.display = "none"
            document.getElementById("set").style.display = "block"
          }
        }
        setSensor(){
        this.storage.set("sensor",this.sensor[0])
        console.log("Set sensor");
        }

        initProgram(){
          this.storage.get("sensor").then(val=>{
            this.sensor[0] = val
          });
          this.storage.get("mode").then(val=>{
            this.mode[0] = val
          });
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
          
       new_minute ;
       sensorRCV(){
        this.socket.fromEvent(this.sub_topic).subscribe(data => {
         this.sensor1 = String(data);
         if(this.sensor1 != null){
          var d = new Date();
          var n = d.getMinutes();
          if(this.new_minute == n){
            this.addData(this.lineChart,"",this.sensor1,this.dev[0].min,this.dev[0].max);
          }
          if(this.new_minute != n){
            this.addData(this.lineChart,n+"m",this.sensor1,this.dev[0].min,this.dev[0].max);
            this.new_minute = n;
          }
         }
         this.removeChartData(this.lineChart);
        })
        }

       readSeansor = setInterval(() => {
         if(this.sensor[0] == "CH1"){
          let mess = JSON.stringify({topic:this.pub_topic,msg:"CH1"})
          this.socket.emit('thanarmq/command',mess);
          //console.log("Analog1")
         }else if(this.sensor[0] == "CH2"){
          let mess = JSON.stringify({topic:this.pub_topic,msg:"CH2"})
          this.socket.emit('thanarmq/command',mess);
         // console.log("Analog2")
         }else if(this.sensor[0] == "CH3"){
          let mess = JSON.stringify({topic:this.pub_topic,msg:"CH3"})
          this.socket.emit('thanarmq/command',mess);
         // console.log("Analog3")
         }else if(this.sensor[0] == "CH4"){
          let mess = JSON.stringify({topic:this.pub_topic,msg:"CH4"})
          this.socket.emit('thanarmq/command',mess);
          //console.log("Analog4")
         }else if(this.sensor[0] == "CH5"){
          let mess = JSON.stringify({topic:this.pub_topic,msg:"CH5"})
          this.socket.emit('thanarmq/command',mess);
          //console.log("Analog5")
         }else if(this.sensor[0] == "CH6"){
          let mess = JSON.stringify({topic:this.pub_topic,msg:"CH6"})
          this.socket.emit('thanarmq/command',mess);
         }
        }, 2000);

        gohome(){
          this.router.navigateByUrl("/home");
        }

       ngOnInit() {
        this.drawChart();
        this.initProgram();
        this.dev[0].name = PUB_TOPIC[0].name;
        }

       ionViewDidLoad(){  
       this.readSeansor;
       }

       ionOnDestroy(){
        clearInterval(this.readSeansor);
        MQTT_MSG[0].msg = '0';
       }

   createDB() {
    this.sqlite.create({
      name: this.database_name,
     location: 'default'
    })
   .then((db: SQLiteObject) => {
   this.databaseObj = db;
   alert('freaky_datatable Database Created!');
    })
   .catch(e => {
    alert("error " + JSON.stringify(e))
   });
  }

  createTable() {
    this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS ' + this.table_name + ' (pid INTEGER PRIMARY KEY, Time varchar(255),Temp varchar(255),Humid varchar(255))', [])
      .then(() => {
        alert('Table Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  getRows() {
    this.databaseObj.executeSql("SELECT * FROM " + this.table_name, [])
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_data.push(res.rows.item(i));
          }
        }
        })
       .catch(e => {
        alert("error " + JSON.stringify(e))
      });
      }

  insertRow() {
    if (!this.time_val.length) {
      alert("Enter Name");
      return;
    }
    this.databaseObj.executeSql('INSERT INTO ' + this.table_name + ' (Time,Temp,Humid) VALUES ("' + this.time_val + '","' + this.temp_val + '","' + this.humid_val + '")', [])
      .then(() => {
        alert('Row Inserted!');
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  deleteRow(item) {
    this.databaseObj.executeSql("DELETE FROM " + this.table_name + " WHERE pid = " + item.pid, [])
      .then((res) => {
        alert("Row Deleted!");
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  goControler(){
    CONTROLLER[0].sensor = this.sensor[0];
    this.router.navigateByUrl('/controler');
  }

  
    
  async presentAlert(str) {
    const alert = await this.alertController.create({
    message: str,
    buttons: ['OK']
    });
  }

  backgroundOn(){
    this.backgroundMode.enable();
    this.backgroundMode.on("activate").subscribe(()=>{
    });
  }

  scheduleNotification(){
    this.localNotifications.schedule({
      id: 1,
      text: 'deltalogic alarm no tification',
      sound:  './assets/sound/notify.mp3',
      trigger:{in:5,unit:ELocalNotificationTriggerUnit.SECOND},
      data: { mydata:'test' },
      foreground:true
    });
  }
}
