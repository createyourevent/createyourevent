import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './productList.component';
import { OrderListModule } from 'primeng/orderlist';
import { SharedModule } from 'app/shared/shared.module';
import { PriceTypeModule } from 'app/views/type-flags/price-type/price-type.module';

@NgModule({
  imports: [
    CommonModule,
    OrderListModule,
    SharedModule,
    PriceTypeModule
  ],
  declarations: [ProductListComponent],
  exports: [ProductListComponent]
})
export class ProductListModule { }
