import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Storage } from '@ionic/storage';
import {App, Events} from 'ionic-angular';
// import { LoginPage } from '../pages/login/login';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable()
export class HttpClient {

  public token = null;

  constructor(public app: App, private http: Http, public storage: Storage, public events: Events) {
    
     this.events.subscribe('jwt:acquire', (jwt) => {         
         this.token = jwt;
         this.storage.set('token', jwt);  
         

         console.log('Token adquirido: ' + jwt) 
     });

     this.events.subscribe('jwt:gone', () => {        
        this.storage.remove('token').then(() => {
            this.token = null;
        })  
     });


     //obtem Token armazenado
     if(this.token == null){
      storage.get('token').then((token) => {
           //this.token = res;
           this.events.publish('jwt:acquire', token);
      });
    }

  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' + this.token); 
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);

    return this.http.get(url, {
      headers: headers
    }).catch(err => this.handleError(err));
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    }).catch(err => this.handleError(err));
  }


  private handleError (error: Response | any) {
   
    let erro = error.json();
            
    console.log('Erro', error);
 
    
    if (erro.error.message == 'Token Inválido'){
        
        this.events.publish('token:gone');
        this.events.publish('user:logout');
        
        // Token Inválido. Redirecionar ao Login
        console.log('Erro de Token. Redirecionando para Login');

        /*if(this.app != null){            
          setTimeout(() => {
            this.app.getActiveNav().popToRoot();
          }, 100);
        }*/

        
        /*if(this.app != null){            
          this.app.getActiveNav().popToRoot();
          console.log('Redirecionado');
        }*/
          
          
    }

    console.error(erro.error.message);
    return Observable.throw(erro.error.message);       
  }

  
}