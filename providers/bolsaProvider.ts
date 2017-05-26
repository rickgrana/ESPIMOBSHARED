import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {CacheService} from "ionic-cache/ionic-cache";
/*import {HttpClient} from '../httpClient';*/

import { environment } from '../../app/environment';

@Injectable()
export class BolsaProvider {

  public url: any;
  public cache: CacheService;
  public info: any;

  constructor(public http: Http, private alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, cache: CacheService) {
    console.log('Hello Bolsa Provider');

    this.cache = cache;

    this.url = environment.API_URL; //'http://sgbu.manaus.am.gov.br/api';
    
  }
    
//this.url = 'http://localhost/dsv/sgbu-mobile/api';
//this.url = this.httpAuth.url;

 getInfo(){   
     let url = this.url + 'default/info';
     let request = this.http.get(url);
     return request.map(res => res.json());        
 }
    
      
  postContato(nome, email, mensagem){
      
      console.log('Enviando mensagem');
      
      var data = JSON.stringify({"nome": nome, "email":email, "mensagem": mensagem});
      
      return this.http.post(this.url + 'default/sendMail', data);
  }
  
  
  
  
  
  
}