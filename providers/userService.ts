import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import {CacheService} from "ionic-cache";
import {AlertController, LoadingController, Events } from 'ionic-angular';
import { BolsaProvider } from './bolsaProvider';
import { Storage } from '@ionic/storage';
import {Http, Headers} from '@angular/http';
import { HttpClient } from './http-client';
import { BaseService } from './baseService';
import { EnvVariables } from '../../environments/environment-variables.token';

@Injectable()
export class UserService extends BaseService {

  public bol_codigo: number = null;
  public user: any;
  url: string;
  //token: string;
  autenticado: boolean = false;
  
  constructor(public http: Http, 
    public storage: Storage, 
    public cache: CacheService, 
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,
    public bolsaProvider: BolsaProvider,
    public httpClient: HttpClient,
    public events: Events,
    @Inject(EnvVariables) public environment) 
    {            
   
     super(httpClient, alertCtrl, environment);

     console.log('Construtor UserService');

     this.events.subscribe('user:login', (user) => {

         this.registerUser(user);
     });

     this.events.subscribe('user:logout', () => {
         this.resetUser();
     });

     this.events.subscribe('solic:update', (qtde) => {
         this.user.solic_nao_lidas = qtde;
     });

     this.events.subscribe('contrap:update', (qtde) => {
         this.user.contrap_nao_lidas = qtde;
     });

     this.events.subscribe('advertencia:update', (qtde) => {
         this.user.adv_nao_lidas = qtde;
     });

     this.events.subscribe('convocacao:update', (qtde) => {
         this.user.conv_nao_lidas = qtde;
     });

     this.events.subscribe('visita:update', (qtde) => {
         this.user.acomp_nao_lidas = qtde;
     });

     
     
  }


  public getToken(){
      return this.httpClient.token;
  }


  getUserName(){
      return this.storage.get('bol_codigo').then((res) => {
         return res;
     });
  }

  isAutenticado(){
     return this.getUserName().then((username) => {
         return username > 0;
     });
  }

  isTokenValido(){
      return this.http.get(this.environment.API_URL + 'login/tokenvalido?token=' + this.getToken()).
            map((res) => res.json(), (err) => err.json()).do(x=> console.log('Check Token:', x));
  }

  loadUserFromServer(bol_codigo){
      return this.getAuthHttp('login/loadUser?bol_codigo='+ bol_codigo);
  }

  getUser(force = false){

     return this.storage.get('user').then((user) => {
         return user;
     });

  }

  login(username, password){
             
      var data = JSON.stringify({"cpf": username, "senha":password});
      
      return this.http.post(this.environment.API_URL + 'login/login', data)
        .map((res) => res.json(), (err) => err.json());
  }

  registerToken(jwt){
      this.storage.set('token', jwt);   
      //this.token = jwt;
      this.httpClient.token =  jwt;    
  }

  registerUser(user){
      
      this.storage.set('bol_codigo', user.bol_codigo);    
            
      this.storage.set('user', JSON.stringify(user));      

      this.cache.saveItem('user', user);   
      
      this.user = user;      

      this.bol_codigo = user.bol_codigo;
  }

  resetUser(){
      this.cache.removeItem('user');
      this.storage.remove('token');
      this.storage.remove('cpf');
      this.storage.remove('bol_codigo');
      this.storage.remove('user');
            
      this.user = null;
      this.bol_codigo = null;
      //this.token =  null;
      this.httpClient.token = null;
  }

  getRedefinirDados(cpf){
      return this.http.get(this.environment.API_URL + 'login/redefinir_opcoes?cpf=' + cpf).map(
          res => res.json(), 
          err => {
              if(err.status != 200) { 
                throw new Error('This request has failed ' + err.status); 
                } // If everything went fine, return the response 
                else {
                    return err.json();
                }
          });
  }
  
  redefinirValidar(bol_codigo, rg, nomeMae, nascimento){
      
      var data = JSON.stringify({
                    "rg": rg, 
                    "nomeMae":nomeMae, 
                    "nascimento": nascimento});
       
      return this.http.post(this.environment.API_URL + 'login/redefinir_validar?bol_codigo=' + bol_codigo, data)
            .map(res => res.json());
  }
  
  redefinirSenha(bol_codigo, token, novaSenha){
      
      var data = JSON.stringify({
                    "token": token,
                    "senha": novaSenha});
       
      return this.http.post(this.environment.API_URL + 'login/redefinir_senha?bol_codigo=' + bol_codigo, data)
            .map(res => res.json());
  }

  // obtem mensagens do bolsista
  getMensagens(){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();

    return this.getAuthHttp('default/mensagens?bol_codigo=' + this.user.bol_codigo)        
        .toPromise()
        .then(               
            (data) => {
                loader.dismiss();

                console.log(data);
                            
                this.user.mensagens           = data.mensagens;
                this.user.mensagens_nao_lidas = data.mensagens_nao_lidas;

                this.events.publish('user:update-messages');
            
                return data.mensagens;    
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Obter Mensagens');
                return Promise.reject('Erro ao Obter Mensagens');
            }            
    );  

      
  }

  

  // Ler uma mensagem selecionada
  lerMensagem(msg_codigo){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();
    
    return this.getAuthHttp('default/lermensagem?msg_codigo='+msg_codigo+'&bol_codigo='+this.user.bol_codigo)        
        .toPromise()
        .then(              
            (data) => {
                loader.dismiss();
                        
                this.user.mensagens           = data.mensagens; // nova lista de mensagens
                this.user.mensagens_nao_lidas = data.mensagens_nao_lidas; // qtde de mensagens nao lidas atualizada

                this.events.publish('user:update-messages');
                            
                return data.mensagem;    // mensagem a ser lida
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Ler Mensagem');
                
                return Promise.reject('Erro ao Obter Mensagem');
            }            
    );  

      
  }

  
  alterarcontatos(telefone, celular, email, email2){
      
      var data = JSON.stringify({                    
                    "telefone": telefone,
                    'celular': celular,
                    'email': email,
                    'email2': email2
        });
       
      return this.httpClient.post(this.environment.API_URL + 'default/alterar_contatos?bol_codigo=' + this.user.bol_codigo, data)
            .map(res => res.json());
  }
  

}
