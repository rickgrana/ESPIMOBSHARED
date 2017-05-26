import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { ConvocacaoService } from '../../providers/convocacaoService';

@Component({
  selector: 'page-convocacoes',
  templateUrl: 'convocacoes.html'
})
export class ConvocacoesPage {

  public lista:  Array<{data: any, icon: string, showDetails: boolean}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, 
    public events: Events,
    public convocacaoService: ConvocacaoService) 
  {
    let data = this.navParams.get('lista'); 

    console.log(data);

    this.formatLista(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConvocacoesPage');
  }

  exibirInfo(){
    let alert = this.alertCtrl.create({
                    title: 'ATENÇÃO',
                    subTitle: 'Para maiores informações, entre em contato com a ESPI' ,
                     buttons: [{text: 'OK'}]                  
    });

     alert.present();  
  }

  doRefresh(refresher) {
   
    this.convocacaoService.listar().then(
      (data) => {
        this.events.publish('convocacao:update', data.nao_lidos);

        this.formatLista(data.lista);
        refresher.complete();
      }
    ); 

  }

  formatLista(data){

    this.lista = [];
    
    for(let i = 0; i < data.length; i++ ){
          this.lista.push({
            data: data[i],
            icon: 'ios-add-circle-outline',
            showDetails: false
          });
      }
  }

  toggleDetails(data) {

    console.log(data);
    
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-add-circle-outline';
    } else {

        if(data.data.bconv_dtlida != null){
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }else{
            this.convocacaoService.ler(data.data.codigo).then(
              (result) => {
              
                  data.showDetails = true;
                  data.icon = 'ios-remove-circle-outline';
                  data.data.bconv_dtlida = true;
              }
            );;
        }
    }
  }

}
