import { Injectable } from '@angular/core';
import { HttpClient } from './http-client';
import {AlertController, LoadingController, Events } from 'ionic-angular';
import { UserService } from './userService';
import { BaseService } from './baseService';

@Injectable()
export class ConvocacaoService extends BaseService {
  
  public bol_codigo: number;

  constructor(
    public httpClient: HttpClient,  
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,
    public events: Events,
    public userService: UserService
    ) 
    {            
        super(httpClient, alertCtrl);

        /*this.userService.getUserName().then((bol_codigo) => {
            this.bol_codigo = bol_codigo;
        });*/

        //this.bol_codigo = this.userService.bol_codigo;
  }
  

  // obtem convocacoes do bolsista
  listar(){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();

    return this.getAuthHttp('convocacao/listar'+'?bol_codigo='+this.userService.bol_codigo)        
        .toPromise()
        .then(               
            (data) => {
                loader.dismiss();           
                return data;    
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Obter Convocações');
                return null;
            }            
    );  

      
  }


  // Ler uma participacao selecionada
  ler(bconv_codigo){   

    let loader = this.loadingCtrl.create({
        content: 'Aguarde...'
    });

    loader.present();
    
    return this.getAuthHttp('convocacao/ler?bconv_codigo='+bconv_codigo+'&bol_codigo='+this.userService.bol_codigo)        
        .toPromise()
        .then(              
            (data) => {
                loader.dismiss();
                                
                //this.userService.user.solic_nao_lidas = data.qtde; // qtde de solicitacoes nao lidas atualizada

                this.events.publish('convocacao:update', data.qtde);
                            
                return data;    // mensagem a ser lida
            },
            (err) => {
                loader.dismiss();
                this.handleError(err, 'Erro ao Ler Convocação');
                return Promise.reject('Erro');

            }            
    );  
    

      
  }


  
}
