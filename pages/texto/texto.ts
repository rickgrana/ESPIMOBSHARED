import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-texto',
  templateUrl: 'texto.html'
})
export class TextoPage {

  titulo: any;
  texto:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.titulo = this.navParams.get("titulo");
    this.texto  = this.navParams.get("texto");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TextoPage');
  }

}
