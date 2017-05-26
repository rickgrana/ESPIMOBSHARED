import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//import { Storage } from '@ionic/storage';
//import {CacheService} from "ionic-cache/ionic-cache";
import {AlertController } from 'ionic-angular';
import { HttpClient } from './http-client';
import { environment } from '../../app/environment';

@Injectable()
export class BaseService {
  
  constructor(public httpClient: HttpClient, public alertCtrl: AlertController){
  }

  getAuthHttp(url){
      return this.httpClient.get(environment.API_URL + url)
        .map(res => res.json());
  }

 

  // metodo generico para tentar se comunicar com o servidor
  protected handleError(err, alertMessage){
        
        let mensagem = '';
        
        try{
            let erro = err.json();
            mensagem = erro.error.message;
        } catch ( jsonError ) {
            mensagem = 'Erro ao tentar se comunicar com o servidor';
        }
                        
        let alert = this.alertCtrl.create({
            title: alertMessage,
            subTitle: mensagem,
                buttons: [
            {
                text: 'OK',
            }]
        });
        
        alert.present();
  }

  
}
