import { Component, Inject } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from '../../providers/userService';

import { EnvVariables } from '../../../environments/environment-variables.token';

@Component({
  selector: 'page-alterarcontatos',
  templateUrl: 'alterarcontatos.html'
})
export class AlterarcontatosPage {

  form: FormGroup;
  telefone: any;
  celular: any;
  email: any;
  email2: any;
  mask = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCel = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    @Inject(EnvVariables) public environment) {

      let bolsista = this.userService.user;

      if(this.environment.SISTEMA != 'PBI'){
        this.form = this.formBuilder.group({
            'telefone': [bolsista.bol_telefone, Validators.required],
            'celular': [bolsista.bol_celular, Validators.required],
            'email': [bolsista.bol_email, Validators.required],
            'email2': [bolsista.bol_email2, Validators.required]
        });
      }else{
         this.form = this.formBuilder.group({
            'telefone': [bolsista.bol_telefone, Validators.required],
            'celular': [bolsista.bol_celular, Validators.required],
            'email': [bolsista.bol_email, Validators.required]
        }); 
      }
          
     this.telefone          = this.form.controls["telefone"];
     this.celular           = this.form.controls["celular"];
     this.email             = this.form.controls["email"];

     this.email2            = this.form.controls["email2"];
     


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlterarcontatosPage');
  }

  submeter(event){
        
     let loader = this.loadingCtrl.create({
        content: 'Validando...'
      });
      
      loader.present();

      let email2 = null;

      if(this.environment.SISTEMA != 'PBI'){
          email2 = this.email2.value
      }
          
      
      this.userService.alterarcontatos(
            this.telefone.value,
            this.celular.value,
            this.email.value,
            email2
            )
        .subscribe(
            data => {
                                          
                let alert = this.alertCtrl.create({
                    title: 'Sucesso',
                    subTitle: 'Contatos atualizados',
                    buttons: [
                    {
                        text: 'OK',
                        handler: () => {
                          alert.dismiss().then(() => {   
                            this.navCtrl.pop().then(() => {}, (error)=>{});
                          }, (error) => {}); 

                          return false; 
                        }                          
                    }]
                });

                let celular = this.celular.value.replace("_", "");
                let telefone = this.telefone.value.replace("_", "");
                
                // atualiza os dados do bolsista no Provider
                this.userService.user.bol_celular = celular
                this.userService.user.bol_telefone = telefone;
                this.userService.user.bol_email = this.email.value;
                this.userService.user.bol_email2 = email2;
                                              
                loader.dismiss().then(() => {                   
                  alert.present();
                });
                                  
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
