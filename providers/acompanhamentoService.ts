import { Injectable, Inject } from '@angular/core';
import { HttpClient } from './http-client';
import {AlertController, LoadingController, Events } from 'ionic-angular';
import { UserService } from './userService';
import { BaseService } from './baseService';

import { EnvVariables } from '../../environments/environment-variables.token';

@Injectable()
export class AcompanhamentoService extends BaseService {
  
  public bol_codigo: number;

  constructor(
    public httpClient: HttpClient,  
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,
    public events: Events,
    public userService: UserService,
    @Inject(EnvVariables) public environment
    ) 
    {            
        super(httpClient, alertCtrl, environment);
    }
  

  // obtem acompanhamentos do bolsista
  listar(){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();

    return this.getAuthHttp('acompanhamento/listar'+'?bol_codigo='+this.userService.bol_codigo)        
        .toPromise()
        .then(               
            (data) => {
                loader.dismiss();           
                return data;    
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Obter Acompanhamentos');
                return null;
            }            
    );  

      
  }


  // Ler um acompanhamento selecionada
  ler(vis_codigo){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();
    
    return this.getAuthHttp('acompanhamento/ler?vis_codigo='+vis_codigo+'&bol_codigo='+this.userService.bol_codigo)        
        .toPromise()
        .then(              
            (data) => {
                loader.dismiss();
                                
                this.events.publish('visita:update', data.qtde);
                            
                return data;    // mensagem a ser lida
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Ler Visita');
                return Promise.reject('Erro');

            }            
    );  
          
  }

  
}