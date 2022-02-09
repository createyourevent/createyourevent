import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps'
import { ServiceBillingComponent } from './service_billing.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceBillingRoutingModule } from './service_billing-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [ServiceBillingComponent],
  imports: [
    CommonModule,
    ServiceBillingRoutingModule,
    GoogleMapsModule,
    MatTabsModule,
    SharedModule,
    CheckboxModule,
    CardModule,
    TableModule,
    FormsModule,
    SelectDropDownModule,
    ButtonModule
  ],
})
export class ServiceBillingModule { }
