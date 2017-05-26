import {AlertController, LoadingController, Events } from 'ionic-angular';
import { HttpClient } from './../../providers/http-client';

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MensagensPage } from '../mensagens/mensagens';
import { SolicitacoesPage } from '../solicitacoes/solicitacoes';
import { ConvocacoesPage } from '../convocacoes/convocacoes';
import { ContrapartidaPage } from '../contrapartida/contrapartida';
import { AdvertenciasPage } from '../advertencias/advertencias';
import { AcompanhamentosPage } from '../acompanhamentos/acompanhamentos';

import { UserService } from '../../providers/userService';
import { SolicitacaoService } from '../../providers/solicitacaoService';
import { ParticipacaoService } from '../../providers/participacaoService';
import { AdvertenciaService } from '../../providers/advertenciaService';
import { ConvocacaoService } from '../../providers/convocacaoService';
import { AcompanhamentoService } from '../../providers/acompanhamentoService';

@Component({
  selector: 'page-painellogado',
  templateUrl: 'painellogado.html',
  providers: [ConvocacaoService, AcompanhamentoService]
})
export class PainellogadoPage {

  mensagens_nao_lidas: any;
  solic_nao_lidas: any;
  conv_nao_lidas: any;
  contrap_nao_lidas: any;
  adv_nao_lidas: any;
  acomp_nao_lidas: any;
  //public solicitacaoService: SolicitacaoService;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public httpClient: HttpClient,  
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,
    public events: Events, 
    public userService: UserService,
    public solicitacaoService: SolicitacaoService,
    public participacaoService: ParticipacaoService,
    public advertenciaService: AdvertenciaService,
    public convocacaoService: ConvocacaoService,
    public acompanhamentoService: AcompanhamentoService
    ) {
      //mensagens_nao_lidas 
    //this.solicitacaoService = new SolicitacaoService(httpClient, alertCtrl, loadingCtrl, events, this.userService.user);     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PainellogadoPage');
  }

  ionViewWillEnter() {
    this.mensagens_nao_lidas = this.userService.user.mensagens_nao_lidas;
    this.solic_nao_lidas = this.userService.user.solic_nao_lidas;
    this.conv_nao_lidas = this.userService.user.conv_nao_lidas;
    this.contrap_nao_lidas = this.userService.user.contrap_nao_lidas;
    this.adv_nao_lidas = this.userService.user.adv_nao_lidas;
    this.acomp_nao_lidas = this.userService.user.acomp_nao_lidas;    
  }

  goToMensagens(){       
     this.navCtrl.push(MensagensPage);
  }

  goToSolicitacoes(){    

    this.solicitacaoService.listar().then(
      (data) => {

          this.events.publish('solic:update', data.nao_lidos);

          this.navCtrl.push(SolicitacoesPage, {'lista': data.lista});
      }
    );
  }

  goToConvocacoes(){    

    this.convocacaoService.listar().then(
      (data) => {
        this.events.publish('convocacao:update', data.nao_lidos);

        this.navCtrl.push(ConvocacoesPage, {'lista': data.lista});
      }
    );
  }

  goToContrapartida(){    

    this.participacaoService.listar().then(
      (data) => {

        this.events.publish('contrap:update', data.nao_lidos);

        this.navCtrl.push(ContrapartidaPage, {'lista': data.lista});
      }
    );
  }

  goToAdvertencias(){    

    this.advertenciaService.listar().then(
      (data) => {

        this.events.publish('advertencia:update', data.nao_lidos);

        this.navCtrl.push(AdvertenciasPage, {'lista': data.lista});
      }
    );
  }


  goToAcompanhamentos(){    

    this.acompanhamentoService.listar().then(
      (data) => {

        this.events.publish('visita:update', data.nao_lidos);

        this.navCtrl.push(AcompanhamentosPage, {'lista': data.lista});
      }
    );
  }

}
