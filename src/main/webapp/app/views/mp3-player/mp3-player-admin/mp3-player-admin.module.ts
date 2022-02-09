import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mp3PlayerAdminComponent } from './mp3-player-admin.component';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { NgxAudioPlayerModule } from 'ngx-audio-player';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    HttpClientModule,
    ToastModule,
    NgxAudioPlayerModule
  ],
  declarations: [Mp3PlayerAdminComponent],
  exports: [Mp3PlayerAdminComponent]
})
export class Mp3PlayerAdminModule { }
