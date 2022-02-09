import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps';
import { BillingComponent } from './billing.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PaymentModule } from 'app/views/payment/payment.module';
import { routesBilling } from './billing.routing';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PleaseWaitDialogModule } from 'app/views/please-wait-dialog/please-wait-dialog.module';


@NgModule({
  declarations: [BillingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routesBilling),
    GoogleMapsModule,
    MatTabsModule,
    SharedModule,
    AccordionModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    PaymentModule,
    TabViewModule,
    ProgressSpinnerModule,
    PleaseWaitDialogModule
  ],
  exports: [RouterModule]
})
export class BillingModule {}
