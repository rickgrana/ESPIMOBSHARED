import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import {AlertController, LoadingController, Events } from 'ionic-angular';
import { UserService } from './userService';
import { HttpClient } from './http-client';
import { BaseService } from './baseService';

import { EnvVariables } from '../../environments/environment-variables.token';


@Injectable()
export class SolicitacaoService extends BaseService {
  
  public bol_codigo: number;

  constructor(
    public httpClient: HttpClient,  
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,
    public events: Events,
    public userService: UserService,
    @Inject(EnvVariables) public environment
    /*,
    private userService: UserService*/
    ) 
    {            
        super(httpClient, alertCtrl, environment);

        this.userService.getUserName().then((bol_codigo) => {
            this.bol_codigo = bol_codigo;
        });

        //this.user = userService;
  }
  

  // obtem solicitacoes do bolsista
  listar(){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();

    return this.getAuthHttp('solicitacao/listar'+'?bol_codigo='+this.userService.bol_codigo)        
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


  // Ler uma solicitacao selecionada
  ler(slc_codigo){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();
    
    return this.getAuthHttp('solicitacao/ler?slc_codigo='+slc_codigo+'&bol_codigo='+this.userService.bol_codigo)        
        .toPromise()
        .then(              
            (data) => {
                loader.dismiss();
                                
                //this.userService.user.solic_nao_lidas = data.qtde; // qtde de solicitacoes nao lidas atualizada
                this.events.publish('solic:update', data.qtde);
                            
                return data;    // mensagem a ser lida
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Ler Solicitação');
                return Promise.reject('Erro');
            }            
    );  

      
  }


  
}

