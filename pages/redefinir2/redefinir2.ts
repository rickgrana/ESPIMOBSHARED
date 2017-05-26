import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from '../../providers/userService';
import { SenhaPage } from '../senha/senha';

@Component({
  selector: 'page-redefinir2',
  templateUrl: 'redefinir2.html'
})
export class Redefinir2Page {

    bol_codigo : any;
    rgOptions : any;
    nomeMaeOptions : any;
    nascimentoOptions : any;

    rg        : any;
    nomeMae   : any;
    nascimento : any;

    form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, 
    public userService: UserService)
  {

    this.form = formBuilder.group({ 
      'rg': ["", Validators.required],
      'nomeMae': ["", Validators.required],
      'nascimento': ["", Validators.required],
    });
    
     this.rg        = this.form.controls["rg"];
     this.nomeMae   = this.form.controls["nomeMae"];
     this.nascimento = this.form.controls["nascimento"];

    this.bol_codigo = this.navParams.get("bol_codigo");
    this.rgOptions = this.navParams.get("rgOptions");
    this.nomeMaeOptions = this.navParams.get("nomeMaeOptions");
    this.nascimentoOptions = this.navParams.get("nascimentoOptions");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Redefinir2Page');
  }


  prosseguir(event){
      
      let loader = this.loadingCtrl.create({
        content: 'Validando...'
      });
      
      loader.present();
      
      this.userService.redefinirValidar(this.bol_codigo, this.rg.value, this.nomeMae.value, this.nascimento.value)
        .subscribe(
            data => {
                loader.dismiss();
                
                this.navCtrl.push(SenhaPage, {
                    'bol_codigo': this.bol_codigo,  
                    'token': data.token                  
                });                    
            },
            err => {
                loader.dismiss();
                
                let erro = err.json();
                                
                let alert = this.alertCtrl.create({
                    title: 'Erro',
                    subTitle: erro.error.message,
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
