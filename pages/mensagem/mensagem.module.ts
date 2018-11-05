import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensagemPage } from './mensagem';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    MensagemPage
    ],
  imports: [
      IonicPageModule.forChild(MensagemPage),
      PipesModule
    ],
})
export class MensagemPageModule { }