import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgbComponent } from './agb.component';
import { AGB_ROUTE } from './agb.routing';
import { RouterModule } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild([AGB_ROUTE]),
    InputSwitchModule
  ],
  declarations: [AgbComponent]
})
export class AgbModule { }
