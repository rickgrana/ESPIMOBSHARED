import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { ParticipacaoService } from '../../providers/participacaoService';


@Component({
  selector: 'page-contrapartida',
  templateUrl: 'contrapartida.html'
})
export class ContrapartidaPage {

  public lista:  Array<{data: any, icon: string, showDetails: boolean}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, 
      public events: Events,  
      public participacaoService: ParticipacaoService) {
    //this.lista = this.navParams.get('lista'); 

    let data = this.navParams.get('lista'); 

    console.log(data);

    this.formatLista(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContrapartidaPage');
  }

  doRefresh(refresher) {
   
    this.participacaoService.listar().then(
      (data) => {
        this.events.publish('contrap:update', data.nao_lidos);

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

        if(data.data.part_dtlida != null){
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }else{
            this.participacaoService.ler(data.data.codigo).then(
              (result) => {
              
                  data.showDetails = true;
                  data.icon = 'ios-remove-circle-outline';
                  data.data.part_dtlida = true;
              }
            );;
        }
    }
  }

}
