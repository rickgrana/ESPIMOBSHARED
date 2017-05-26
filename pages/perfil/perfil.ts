import { Component  } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { BolsaProvider } from '../../providers/bolsaProvider';
import { UserService } from '../../providers/userService';

import { SenhaPage } from '../senha/senha';
import { AlterarcontatosPage } from '../alterarcontatos/alterarcontatos';



@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  bolsista: any;
  appInfo: any;
  ctrl_fone: string;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, 
    public bolsaProvider: BolsaProvider, public events: Events) {
   
   this.bolsista = this.userService.user;
   

    this.appInfo = null;
    this.ctrl_fone = null;
    
    /*this.bolsaProvider.getInfo().subscribe(
        data => {         
            this.appInfo = data; 
            this.ctrl_fone = data.controle.ctrl_fone;  
    });*/

  }

  ionViewDidLoad() {
    

  }

  logout(){    
    //this.navCtrl.rootNav.setRoot(LoginPage);
    
    this.events.publish('user:logout');
    this.events.publish('jwt:gone');    
  }

  goToAtualizar(){    
    this.navCtrl.push(AlterarcontatosPage);
  }
  
  senha(){
    this.navCtrl.push(SenhaPage,
      {
          'bol_codigo': this.userService.user.bol_codigo,
          'token': this.userService.getToken()
      });
  }


}
