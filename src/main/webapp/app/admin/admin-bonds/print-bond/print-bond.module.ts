import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintBondComponent } from './print-bond.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PRINTBOND_ROUTE } from './print-bond.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([PRINTBOND_ROUTE]),
  ],
  declarations: [PrintBondComponent]
})
export class PrintBondModule { }
