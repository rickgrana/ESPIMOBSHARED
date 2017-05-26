import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { AdvertenciaService } from '../../providers/advertenciaService';

@Component({
  selector: 'page-advertencias',
  templateUrl: 'advertencias.html'
})
export class AdvertenciasPage {


  public lista:  Array<{data: any, icon: string, showDetails: boolean}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, 
    public events: Events,
    public advertenciaService: AdvertenciaService) 
  {
    //this.lista = this.navParams.get('lista'); 

    let data = this.navParams.get('lista'); 

    this.formatLista(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvertenciasPage');
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



  doRefresh(refresher) {
   
    this.advertenciaService.listar().then(
      (data) => {

        this.events.publish('advertencia:update', data.nao_lidos);
       
        this.formatLista(data.lista);

        refresher.complete();
      }
    ); 

  }

  toggleDetails(data) {

    console.log(data);
    
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-add-circle-outline';
    } else {

        if(data.data.adv_dtlida != null){
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }else{
            this.advertenciaService.ler(data.data.codigo).then(
              (result) => {      
    
                  data.showDetails = true;
                  data.icon = 'ios-remove-circle-outline';
                  data.data.adv_dtlida = true;
              },
              (err) => {
                  console.log("erro");
              }
            );
        }
    }
  }

}
