import { Component, Inject  } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { AlertController, LoadingController } from 'ionic-angular';

import { BolsaProvider } from '../../providers/bolsaProvider';
import { UserService } from '../../providers/userService';

import { SenhaPage } from '../senha/senha';
import { AlterarcontatosPage } from '../alterarcontatos/alterarcontatos';

import {CacheService} from "ionic-cache";

import { EnvVariables } from '../../../environments/environment-variables.token';



@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  bolsista: any;
  appInfo: any;
  ctrl_fone: string;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, 
    public bolsaProvider: BolsaProvider, public events: Events,
    public cache: CacheService, 
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,   
    @Inject(EnvVariables) public environment) {
   
   this.bolsista = this.userService.user;
   

    this.appInfo = null;
    this.ctrl_fone = null;
    
    // carrega Valores
    let key = 'app-info';


    this.bolsaProvider.info = 
        this.cache.getItem(key).catch(() => {

            let loader = this.loadingCtrl.create({
                content: 'Carregando...'
            });
            
            loader.present();

            return this.bolsaProvider.getInfo().subscribe(
              data => {

                console.log(data);
                loader.dismiss();

                this.ctrl_fone = data.controle.ctrl_fone;

                this.bolsaProvider.info = data;              
                
                return this.cache.saveItem(key, data);
              },
              error => {
                loader.dismiss();  
                this.showError(error);
              });

        });

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


  showError(erro){

    console.log(erro);

    var alert = this.alertCtrl.create({
              title: 'Atenção',
              subTitle: 'Não foi possível obter os dados do servidor',
              buttons: [
                {
                    text: 'Tentar novamente',
                    handler: () => {  

                      alert.dismiss();

                      return false;                                                                                                  
                    }
                }
              ]
          });

          alert.present();
  }


}
