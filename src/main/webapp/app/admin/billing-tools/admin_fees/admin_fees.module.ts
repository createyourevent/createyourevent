import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps'
import { AdminFeesComponent } from './admin_fees.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminFeesRoutingModule } from './admin_fees.route';
import { InputNumberModule } from 'primeng/inputnumber';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [AdminFeesComponent],
  imports: [
    CommonModule,
    AdminFeesRoutingModule,
    GoogleMapsModule,
    MatTabsModule,
    SharedModule,
    InputNumberModule
  ],
})
export class AdminFeesModule { }
