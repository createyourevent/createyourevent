import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyTicketComponent } from './buy-ticket.component';
import { ButtonModule } from 'primeng/button';
import { BuyTicketDatatransComponent } from './buy-ticket-datatrans/buy-ticket-datatrans.component';
import { PaymentModule } from '../payment/payment.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    PaymentModule,
    ToastModule
  ],
  declarations: [BuyTicketComponent, BuyTicketDatatransComponent ]
})
export class BuyTicketModule { }
