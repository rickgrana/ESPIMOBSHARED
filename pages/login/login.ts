import {Component } from '@angular/core';

import {NavController, NavParams, AlertController, LoadingController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

 import { VisitantePage } from '../visitante/visitante';
 import { RedefinirPage } from '../redefinir/redefinir';
import { LogadoPage } from '../logado/logado';

import { BolsaProvider } from '../../providers/bolsaProvider';
import { UserService } from '../../providers/userService';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  form: FormGroup;
  nav: NavController;

  cpf: any;
  senha: any;


  mask_cpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, 
    private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    public bolsaProvider: BolsaProvider,
    public userService: UserService,
    public events: Events) 
{
     console.log('Hello LoginPage');
      //this.bolsaProvider = bolsaProvider;
      
      this.form = this.formBuilder.group({
        'cpf': ["", [Validators.required, Validators.minLength(11)]], 
        'senha': ["", Validators.required]
      });

      this.nav = navCtrl;

      this.cpf = this.form.controls["cpf"];
      this.senha = this.form.controls["senha"]; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToMainPage(){        
    this.nav.push(VisitantePage);         
  }

  goToRedefinir(){
    this.nav.push(RedefinirPage);
  }

  goToLogado(){
    this.nav.push(LogadoPage);
  }


  login(event){
      event.preventDefault();
      
      let loader = this.loadingCtrl.create({
        content: 'Autenticando...'
      });
      
      loader.present();

      let cpf = this.cpf.value.replace(".", "").replace(".", "").replace("-", "");
      
      this.userService.login(cpf, this.senha.value).subscribe(
        data => {
                                   
            this.events.publish('jwt:acquire', data.jwt);    
            this.events.publish('user:login', data.user);
           
            loader.dismiss().then(() => {
            });     
              
        },
        err => {
            
            loader.dismiss();   
            
            let mensagem = null;
                
                try{
                    let erro = err.json();
                    mensagem = erro.error.message;
                } catch ( jsonError ) {
                    mensagem = 'Erro ao tentar se comunicar com o servidor';
                }
                                
                let alert = this.alertCtrl.create({
                    title: 'Erro no Login',
                    subTitle: mensagem,
                     buttons: [
                    {
                        text: 'OK',
                    }]
                });
                                 
                alert.present();
            
            
         }
        );
  }

}
