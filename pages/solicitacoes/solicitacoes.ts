import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { SolicitacaoService } from '../../providers/solicitacaoService';

@Component({
  selector: 'page-solicitacoes',
  templateUrl: 'solicitacoes.html'
})
export class SolicitacoesPage {

  public lista:  Array<{data: any, icon: string, showDetails: boolean}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, 
    public events: Events,
    public solicitacaoService: SolicitacaoService
    ) {
    
    let data = this.navParams.get('lista'); 

    this.formatLista(data);
  }

  ionViewDidLoad() {
    
  }


  doRefresh(refresher) {
    this.solicitacaoService.listar().then(
      (data) => {

        this.events.publish('solic:update', data.nao_lidos);

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

    console.log(this.lista);  
  }

  toggleDetails(data) {

    console.log(data);
    
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-add-circle-outline';
    } else {

        if(data.data.slc_dtlida != null){
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }else{
            this.solicitacaoService.ler(data.data.codigo).then(
              (result) => {
              
                  data.showDetails = true;
                  data.icon = 'ios-remove-circle-outline';
                  data.data.slc_dtlida = true;
              }
            );;
        }
    }
  }

}
