import { Component } from '@angular/core';
import { NavController, NavParams, Events} from 'ionic-angular';
import { UserService } from '../../providers/userService';
//import {MensagemPage} from '../mensagem/mensagem';

@Component({
  selector: 'page-mensagens',
  templateUrl: 'mensagens.html'
})
export class MensagensPage {

  mensagens: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public userService: UserService,
    public events: Events) 
  {
    this.mensagens = this.userService.user.mensagens;

    this.events.subscribe('user:update-messages', () => {
        this.mensagens = this.userService.user.mensagens;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MensagensPage');
  }

  lerMensagem(msg_codigo){

    let mensagem = null;

    this.userService.lerMensagem(msg_codigo).then(
      (data) => {
        mensagem = data;
        this.navCtrl.push('MensagemPage', {'mensagem': mensagem });
      }
    );    
    
  }

  doRefresh(refresher) {

    this.userService.getMensagens().then(
      (mensagens) => {
        console.log(mensagens);
          this.mensagens = mensagens;
          refresher.complete();
      }
    );    

  }

}
