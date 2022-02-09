import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { PriceTypeComponent } from './price-type.component';

@NgModule({
  imports: [SharedModule],
  declarations: [PriceTypeComponent],
  exports: [PriceTypeComponent]
})
export class PriceTypeModule {}
