import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from '../../providers/userService';


@Component({
  selector: 'page-senha',
  templateUrl: 'senha.html'
})
export class SenhaPage {

  bol_codigo: any;
  token: any;
  form: FormGroup;
  senha: any;
  repetir:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, 
    public userService: UserService) 
  {
    this.bol_codigo = this.navParams.get("bol_codigo");
    this.token      = this.navParams.get("token");
    
    this.form = this.formBuilder.group({ 
      'senha': ["", Validators.required],
      'repetir': ["", Validators.required]
    });
    
     this.senha        = this.form.controls["senha"];
     this.repetir        = this.form.controls["repetir"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenhaPage');
  }

  altersenha(event){
      
      let loader = this.loadingCtrl.create({
        content: 'Enviando...'
      });
      
      loader.present();
      
      this.userService.redefinirSenha(this.bol_codigo, this.token, this.senha.value)
        .subscribe(
            data => {
                loader.dismiss();
                
                let alert = this.alertCtrl.create({
                    title: 'Sucesso',
                    subTitle: 'Senha alterada com Sucesso! Efetue o Login',
                     buttons: [
                    {
                        text: 'OK',
                        handler: data => {                            
                            this.navCtrl.popToRoot();                            
                        }
                    }]
                });
                
                alert.present();
                                  
            },
            err => {
                loader.dismiss();
                
                let mensagem = '';
                
                try{
                    let erro = err.json();
                    mensagem = erro.error.message;
                } catch ( jsonError ) {
                    mensagem = 'Erro ao tentar se comunicar com o servidor';
                }
                                
                let alert = this.alertCtrl.create({
                    title: 'Erro',
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
