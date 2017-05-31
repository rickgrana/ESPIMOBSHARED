import { Injectable, Inject } from '@angular/core';
import { HttpClient } from './http-client';
import {AlertController, LoadingController, Events } from 'ionic-angular';
import { UserService } from './userService';
import { BaseService } from './baseService';

import { EnvVariables } from '../../environments/environment-variables.token';

@Injectable()
export class ParticipacaoService extends BaseService {
  
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

        this.userService.getUserName().then((bol_codigo) => {
            this.bol_codigo = bol_codigo;
        });

        //this.user = userService;
  }
  

  // obtem participacoes do bolsista
  listar(){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();

    return this.getAuthHttp('participacao/listar'+'?bol_codigo='+this.userService.bol_codigo)        
        .toPromise()
        .then(               
            (data) => {
                loader.dismiss();           
                return data;    
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Obter Solicitações');
                return null;
            }            
    );  

      
  }


  // Ler uma participacao selecionada
  ler(part_codigo){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();
    
    return this.getAuthHttp('participacao/ler?part_codigo='+part_codigo+'&bol_codigo='+this.userService.bol_codigo)        
        .toPromise()
        .then(              
            (data) => {
                loader.dismiss();
                                
                //this.userService.user.solic_nao_lidas = data.qtde; // qtde de solicitacoes nao lidas atualizada

                this.events.publish('contrap:update', data.qtde);
                            
                return data;    // mensagem a ser lida
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Ler Participação');
                return Promise.reject('Erro');
            }            
    );  
    

      
  }


  
}
