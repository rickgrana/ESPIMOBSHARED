import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from '../../providers/userService';
import { Redefinir2Page } from '../redefinir2/redefinir2';

@Component({
  selector: 'page-redefinir',
  templateUrl: 'redefinir.html'
})
export class RedefinirPage {

  form: FormGroup;
  cpf: any;

  mask_cpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, 
    public userService: UserService) 
  {
    this.form = this.formBuilder.group({
        'cpf': ["", [Validators.required, Validators.minLength(11)]]
      });

    this.cpf = this.form.controls["cpf"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RedefinirPage');
  }


  proximo(event){
      
      let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      
      loader.present();

      let cpf = this.cpf.value.replace(".", "").replace(".", "").replace("-", "");
      
      this.userService.getRedefinirDados(cpf)
        .subscribe(
            data => {
                loader.dismiss();
                
                this.navCtrl.push(Redefinir2Page, {
                    'bol_codigo': data.bol_codigo,
                    'rgOptions': data.rgOptions,
                    'nomeMaeOptions': data.nomeMaeOptions,
                    'nascimentoOptions': data.nascimentoOptions
                });                    
            },
            err => {     

                loader.dismiss();

                let message = 'Servidor não disponível';   
                
                if(err.status > 0){
                  let erro = err.json();
                  message = erro.error.message;
                }
                
                let alert = this.alertCtrl.create({
                    title: 'Erro',
                    subTitle: message,
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
