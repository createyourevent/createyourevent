import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PleaseWaitDialogComponent } from './please-wait-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    ProgressBarModule,
    SharedModule
  ],
  declarations: [PleaseWaitDialogComponent],
  exports: [PleaseWaitDialogComponent]
})
export class PleaseWaitDialogModule { }
