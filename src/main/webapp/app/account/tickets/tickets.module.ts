import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayTicketComponent } from './payTicket/payTicket.component';
import { TicketsComponent } from './tickets.component';
import { RouterModule } from '@angular/router';
import { ticketsRoute } from './tickets.routing';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentModule } from 'app/views/payment/payment.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ticketsRoute),
    SharedModule,
    ButtonModule,
    TabViewModule,
    PaymentModule,
    InputTextModule
  ],
  declarations: [TicketsComponent, PayTicketComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class TicketsModule {  }
