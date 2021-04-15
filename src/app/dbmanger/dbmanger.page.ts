import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {HomePage} from '../home/home.page'

@Component({
  selector: 'app-dbmanger',
  templateUrl: './dbmanger.page.html',
  styleUrls: ['./dbmanger.page.scss'],
})
export class DBMangerPage implements OnInit {

  databaseObj: SQLiteObject; // Database instance object
  time_val:string = ""; // Input field model
  temp_val:string=""//input field temp
  humid_val:string=""//input field humid
  row_data: any = []; // Table rows
  database_name:string = "data.db"; // DB name
  table_name:string = "environment"; // Table name

  deviceList =[{"name":"ESP8266","status":"Disconected!"},{"name":"ESP32","status":"Disconected!"}];

   project=[{
        'id':"1",
        'name':'NODE ESP8266',
        'date':'',
         },
         {
         'id':"2",
         'name':'NODE ESP32',
         'date':'',
          }
          ];
 
  constructor(
    private platform: Platform,
    public storage: Storage,
    private sqlite: SQLite
  ) { 
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    })
  this.getTime;
  }

  ngOnInit() {
    this.storage.set("page","dbmanager");
  }
  

  ionViewDidLoad(){  
    this.saveConfig();
    this.storage.set("page","dbmanager");
    }

    ngOnDestroy(){
      clearInterval(this.getTime);
     }
  
    saveConfig(){
    this.platform.ready().then(() => {
    });
    }
  

    private getTime = setInterval(() => { 
     var today = new Date();
     var h = today.getHours();
     var m = today.getMinutes();
     var s = today.getSeconds();
     m = this.checkTime(m);
     s = this.checkTime(s);
     this.time_val=h + ":" + m + ":" + s;
     this.storage.get("sensorval").then(data=>{
      let obj=JSON.stringify(data);
      let par =JSON.parse(obj);
      });

      }, 1000);
    

    checkTime(i) {
      if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
      return i;
    }

  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        alert('Database found ');
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

}
