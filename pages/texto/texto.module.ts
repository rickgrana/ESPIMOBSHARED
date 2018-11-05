import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TextoPage } from './texto';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
      TextoPage
    ],
  imports: [
      IonicPageModule.forChild(TextoPage),
      PipesModule
    ],
})
export class TextoPageModule { }