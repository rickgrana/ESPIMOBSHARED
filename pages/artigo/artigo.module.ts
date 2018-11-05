import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArtigoPage } from './artigo';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    ArtigoPage
    ],
  imports: [
      IonicPageModule.forChild(ArtigoPage),
      PipesModule
    ],
})
export class ArtigoPageModule { }