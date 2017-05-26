import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PainellogadoPage } from '../painellogado/painellogado';
import { PerfilPage } from '../perfil/perfil';
import { VisitantePage } from '../visitante/visitante';


@Component({
  selector: 'page-logado',
  templateUrl: 'logado.html'
})
export class LogadoPage {

  tab1Root: any = PainellogadoPage;
  tab2Root: any = PerfilPage;
  tab3Root: any = VisitantePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogadoPage');
  }

}
