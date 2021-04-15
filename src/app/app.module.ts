import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { SQLite} from '@ionic-native/sqlite/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
const config: SocketIoConfig = { url: 'https://thanarmq.herokuapp.com', options: {} };
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  BrowserModule,
  IonicModule.forRoot(),
  AppRoutingModule,
  HttpClientModule,
  IonicStorageModule.forRoot(),
  SocketIoModule.forRoot(config),
  BrowserAnimationsModule
  ],
  providers: [
  StatusBar,
  SplashScreen,
  NativeStorage,
  SQLite,
  UniqueDeviceID,
  LocalNotifications,
  EmailComposer,
  BackgroundMode,
  NativeAudio,
  SpeechRecognition,
  TextToSpeech,
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
