import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { SharedModule } from 'app/shared/shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { STRIPE_TEST } from 'app/constants';
import { NgxStripeModule } from 'ngx-stripe';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxPayPalModule } from 'ngx-paypal';
import { ReactFeelingFormComponent } from '../datatrans_react/Datatrans.component';
import { SuccessfullComponent } from './successfull/successfull.component';
import { PAYMENT_ROUTE } from './payment.routing';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CancelComponent } from './cancel/cancel.component';
import { ErrorComponent } from './error/error.component';
import { PleaseWaitDialogModule } from '../please-wait-dialog/please-wait-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    NgxStripeModule.forRoot(STRIPE_TEST),
    ToastModule,
    SharedModule,
    ButtonModule,
    MatToolbarModule,
    NgxPayPalModule,
    RouterModule.forChild(PAYMENT_ROUTE),
    ProgressSpinnerModule,
    PleaseWaitDialogModule
  ],
  declarations: [PaymentComponent, ReactFeelingFormComponent, SuccessfullComponent, ErrorComponent, CancelComponent],
  exports: [PaymentComponent, ReactFeelingFormComponent]
})
export class PaymentModule { }
