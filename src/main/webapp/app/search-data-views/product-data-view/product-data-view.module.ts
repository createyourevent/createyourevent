import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'app/shared/shared.module';
import { ProductDataViewRoutes } from './product-data-view.routing';
import { InputTextModule } from 'primeng/inputtext';
import { ProductDataViewComponent } from './product-data-view.component';
import { PriceTypeModule } from 'app/views/type-flags/price-type/price-type.module';
import { KnobModule } from 'primeng/knob';

@NgModule({
  imports: [CommonModule, SharedModule, DataViewModule, ProductDataViewRoutes, InputTextModule, PriceTypeModule, KnobModule],
  declarations: [ProductDataViewComponent]
})
export class ProductDataViewModule {}
