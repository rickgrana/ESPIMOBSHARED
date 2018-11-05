import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticiasPage } from './noticias';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    NoticiasPage
    ],
  imports: [
      IonicPageModule.forChild(NoticiasPage),
      PipesModule
    ],
})
export class NoticiasPageModule { }