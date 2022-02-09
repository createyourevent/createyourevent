import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashboxComponent } from './cashbox.component';
import { CashboxRoutes } from './cashbox.routing';
import { SharedModule } from 'app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { PaymentModule } from 'app/views/payment/payment.module';

@NgModule({
  imports: [
    CommonModule,
    CashboxRoutes,
    SharedModule,
    TableModule,
    PaymentModule
  ],
  declarations: [CashboxComponent]
})
export class CashboxModule { }
