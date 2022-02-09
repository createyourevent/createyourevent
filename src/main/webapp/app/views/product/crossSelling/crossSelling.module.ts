import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossSellingComponent } from './crossSelling.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'app/shared/shared.module';
import { PriceTypeModule } from 'app/views/type-flags/price-type/price-type.module';

@NgModule({
  imports: [CommonModule, DataViewModule, SharedModule, PriceTypeModule],
  declarations: [CrossSellingComponent],
  exports: [CrossSellingComponent]
})
export class CrossSellingModule {}
