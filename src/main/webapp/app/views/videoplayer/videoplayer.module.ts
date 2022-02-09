import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoplayerComponent } from './videoplayer.component';


import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';

@NgModule({
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  declarations: [VideoplayerComponent],
  exports: [VideoplayerComponent]
})
export class VideoplayerModule { }
