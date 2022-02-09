import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CartComponent } from './cart.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { OrderListModule } from 'primeng/orderlist';



@NgModule({
  imports: [SharedModule, SidebarModule, ButtonModule, OrderListModule],
  declarations: [CartComponent],
  exports: [CartComponent]
})
export class CartModule {}
