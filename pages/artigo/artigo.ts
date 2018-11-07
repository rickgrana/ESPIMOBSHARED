import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-artigo',
  templateUrl: 'artigo.html'
})
export class ArtigoPage {

  titulo: any;
  texto: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.titulo = this.navParams.get("titulo");
    this.texto  = this.navParams.get("texto");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtigoPage');
  }

}
