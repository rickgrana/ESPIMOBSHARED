import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-mensagem',
  templateUrl: 'mensagem.html'
})
export class MensagemPage {

  public mensagem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.mensagem = this.navParams.get("mensagem");    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MensagemPage');
  }

}
