import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { WpService } from '../../providers/wp-service';
import { ArtigoPage } from '../artigo/artigo';

@Component({
  selector: 'page-noticias',
  templateUrl: 'noticias.html'
})
export class NoticiasPage {

  posts: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public wpService: WpService, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController) 
  {
    this.posts = this.navParams.get("posts");
    this.wpService = wpService;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticiasPage');
  }

  goToPost(post_id){    

    let loader = this.loadingCtrl.create({
        content: 'Carregando...'
    });
      
    loader.present();

    this.wpService.load(post_id).subscribe(
        data => {
            this.navCtrl.push(ArtigoPage, {titulo: data.title, texto: data.content});
        },
        err => {
                
                let mensagem = null;
                
                try{
                    let erro = err.json();
                    mensagem = erro.error.message;
                } catch ( jsonError ) {
                    mensagem = 'Erro ao tentar se comunicar com o servidor';
                }
                                
                let alert = this.alertCtrl.create({
                    title: 'Erro ao carregar Notícia',
                    subTitle: mensagem,
                     buttons: [
                    {
                        text: 'OK',
                    }]
                });
                
                alert.present();
            },
        () => {
            loader.dismiss();
        }   
    );   
  }

}
