import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mp3PlayerComponent } from './mp3-player.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';

@NgModule({
  imports: [
    CommonModule,
    NgxAudioPlayerModule
  ],
  declarations: [Mp3PlayerComponent],
  exports: [Mp3PlayerComponent]
})
export class Mp3PlayerModule { }
