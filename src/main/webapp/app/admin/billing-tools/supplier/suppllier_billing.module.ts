import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps'
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { SupplierBillingComponent } from './suppllier_billing.component';
import { SupplierBillingRoutingModule } from './suppllier_billing-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [SupplierBillingComponent],
  imports: [
    CommonModule,
    SupplierBillingRoutingModule,
    GoogleMapsModule,
    MatTabsModule,
    SharedModule,
    CheckboxModule,
    TableModule,
    FormsModule,
    SelectDropDownModule,
    ButtonModule
  ],
})
export class SupplierBillingModule { }
