import { Injectable, Inject } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//import { Storage } from '@ionic/storage';
//import {CacheService} from "ionic-cache";
import {AlertController } from 'ionic-angular';
import { HttpClient } from './http-client';
import { EnvVariables } from '../../environments/environment-variables.token';

@Injectable()
export class BaseService {
  
  constructor(public httpClient: HttpClient, public alertCtrl: AlertController, @Inject(EnvVariables) public environment){
  }

  getAuthHttp(url){
      return this.httpClient.get(this.environment.API_URL + url)
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
