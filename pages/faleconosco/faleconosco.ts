import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { BolsaProvider } from '../../providers/bolsaProvider';

@Component({
  selector: 'page-faleconosco',
  templateUrl: 'faleconosco.html'
})
export class FaleconoscoPage {

  contatoForm: FormGroup;
  bolsaProvider: BolsaProvider;
  nome: any;
  email: any;
  mensagem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
        public loadingCtrl: LoadingController, public alertCtrl: AlertController, 
        private formBuilder: FormBuilder, bolsaProvider: BolsaProvider) {
      this.contatoForm = formBuilder.group({ 
        'nome': ["", Validators.required], 
        'email': ["", Validators.required],
        'mensagem': ["", Validators.required]
      });

      this.nome = this.contatoForm.controls["nome"];
      this.email = this.contatoForm.controls["email"];
      this.mensagem = this.contatoForm.controls["mensagem"];

      this.bolsaProvider = bolsaProvider;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaleconoscoPage');
  }

  enviar(event){
      event.preventDefault();

      let loader = this.loadingCtrl.create({
        content: 'Enviando...'
      });
      
      loader.present();
      
      this.bolsaProvider.postContato(this.nome.value, this.email.value, this.mensagem.value).subscribe(
        data => {
            loader.dismiss();

            let alert = this.alertCtrl.create({
                title: 'Sucesso!',
                subTitle: 'Sua mensagem foi enviada. Obrigado!',
                buttons: [
                {
                    text: 'OK',
                    handler: data => {                        
                        this.navCtrl.pop();
                    }
                }]
            });
                        
            alert.present();
            
              
        },
        err => {
            loader.dismiss();

            let alert = this.alertCtrl.create({
                title: 'Atenção!',
                subTitle: 'Ocorreu um erro ao tentar enviar sua mensagem',
                buttons: ['OK']
            });
            
                     
            alert.present();
                     
         }
        );

  }

}
