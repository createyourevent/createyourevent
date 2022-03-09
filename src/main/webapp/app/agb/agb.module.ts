import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgbComponent } from './agb.component';
import { AGB_ROUTE } from './agb.routing';
import { RouterModule } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedModule } from 'app/shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [SharedModule, CommonModule, RouterModule.forChild([AGB_ROUTE]), InputSwitchModule, PdfViewerModule],
  declarations: [AgbComponent],
})
export class AgbModule {}
