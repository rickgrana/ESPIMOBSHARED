import { Component } from '@angular/core';
import { App, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { FaleconoscoPage } from '../faleconosco/faleconosco';
import { MapaPage } from '../mapa/mapa';

import { TextoPage } from '../texto/texto';

import { NoticiasPage } from '../noticias/noticias';

import { BolsaProvider } from '../../providers/bolsaProvider';
import { WpService } from '../../providers/wp-service';

import {CacheService} from "ionic-cache/ionic-cache";

import {environment} from "../../../app/environment";

@Component({
  selector: 'page-visitante',
  templateUrl: 'visitante.html'
})
export class VisitantePage {

  nav: NavController;
  wpService: WpService;

  posts: any;
  environment: any;

  constructor(
      public app:App,
      public navCtrl: NavController, public navParams: NavParams, 
      public loadingCtrl: LoadingController, public alertCtrl: AlertController,
      public bolsaProvider: BolsaProvider, wpService: WpService,
      public cache: CacheService) 
  {
    this.nav = navCtrl;
    //this.bolsaProvider = bolsaProvider;
    this.wpService = wpService;

    this.environment = environment;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitantePage');

    // carrega Valores
    let key = 'app-info';

    this.cache.getItem(key).catch(() => {

        let loader = this.loadingCtrl.create({
            content: 'Carregando...'
        });
        
        loader.present();

        return this.bolsaProvider.getInfo().subscribe(
          data => {
            loader.dismiss();  
            console.log("Dados da Aplicação carregados do servidor");

            this.bolsaProvider.info = data;              
            
            return this.cache.saveItem(key, data);
          },
          error => {
            loader.dismiss();  
            this.showError(error);
          });
    }).then((data) => {
        console.log("Dados da Aplicação carregados do cache");
        this.bolsaProvider.info = data;
    });
  }


  goToContato(){    
    this.nav.push(FaleconoscoPage);
  }

  goToMapa(){    
    this.nav.push(MapaPage);
  }

  goToAbout(){
    this.nav.push(TextoPage, {
        'titulo': 'Sobre o Programa',
        'texto': this.bolsaProvider.info.quemsomos
    });
  }

   goToFAQ(){    
    this.nav.push(TextoPage, {
        'titulo': 'FAQ',
        'texto': this.bolsaProvider.info.perguntasfrequentes
    });
  }
  
  goToCronograma(){
    
    this.nav.push(TextoPage, {
        'titulo': 'Cronograma',
        'texto': this.bolsaProvider.info.calendario    
    });
  } 


  goToNoticias(){    
        
    let loader = this.loadingCtrl.create({
        content: 'Carregando...'
    });
      
    loader.present();
    
    this.posts = null;
            
    this.wpService.loadPosts().subscribe(
            data => {  

                loader.dismiss();

                this.posts = data;  
                
                if(this.posts.length == 0){
                    let alert = this.alertCtrl.create({
                        title: 'Atenção',
                        subTitle: 'Não há notícias a exibir',
                        buttons: [
                        {
                            text: 'OK',
                        }]
                    });
                    
                    alert.present();
                }else{
                    this.nav.push(NoticiasPage, {'posts': this.posts});
                }                                             
            },
            err => {
                
                loader.dismiss();
                
                let mensagem = null;
                
                try{
                    let erro = err.json();
                    mensagem = erro.error.message;
                } catch ( jsonError ) {
                    mensagem = 'Erro ao tentar se comunicar com o servidor';
                }
                                
                let alert = this.alertCtrl.create({
                    title: 'Erro ao carregar notícias',
                    subTitle: mensagem,
                     buttons: [
                    {
                        text: 'OK',
                    }]
                });
                
                alert.present();
            },
            () => {
                 
            }           
        );
  }

  showError(erro){

    console.log(erro);

    var alert = this.alertCtrl.create({
              title: 'Atenção',
              subTitle: 'Não foi possível obter os dados do servidor',
              buttons: [
                {
                    text: 'OK',
                    handler: () => {  

                      alert.dismiss();

                      this.navCtrl.pop();
                      return false;                                                                                                  
                    }
                }
              ]
          });

          alert.present();
  }

  

}
