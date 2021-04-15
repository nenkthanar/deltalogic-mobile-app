import { Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {  NgZone } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
@Component({
  selector: 'app-voicecommand',
  templateUrl: './voicecommand.page.html',
  styleUrls: ['./voicecommand.page.scss'],
})
export class VoicecommandPage implements OnInit {
  isListening: boolean = false;
  matches: Array<String>;
  text_sentences = [];
  constructor(
    public speech: SpeechRecognition, 
    private zone: NgZone,
    private tts: TextToSpeech
  ) {
    this.text_sentences = [
      "ร้อนมากคะทำยังไงดี",
      "If you can't have fun, there's no sense in doing it.",
      "Stand up for what is right, regardless of who is committing the wrong."
    ]
   }

   textToSpeech(text) {
    this.tts.speak(text)
    this.tts.speak({
      text: text,
      locale: 'th-GB',
      rate: 0.75
  })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

  async hasPermission():Promise<boolean> {
    try {
      const permission = await this.speech.hasPermission();
      console.log(permission);

      return permission;
    } catch(e) {
      console.log(e);
    }
  }

  async getPermission():Promise<void> {
    try {
      this.speech.requestPermission();
    } catch(e) {
      console.log(e);
    }
  }

  listen(): void {
    console.log('listen action triggered');
    if (this.isListening) {
      this.speech.stopListening();
      this.toggleListenMode();
      return;
    }

    this.toggleListenMode();
    let _this = this;

    this.speech.startListening()
      .subscribe(matches => {
        _this.zone.run(() => {
          _this.matches = matches;
        })
      }, error => console.error(error));

  }

  toggleListenMode():void {
    this.isListening = this.isListening ? false : true;
    console.log('listening mode is now : ' + this.isListening);
  }

  ngOnInit() {
  }

}
