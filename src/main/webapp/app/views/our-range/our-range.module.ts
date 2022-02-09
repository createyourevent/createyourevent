import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OurRangeComponent } from './our-range.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [OurRangeComponent],
  exports: [OurRangeComponent],
})
export class OurRangeModule { }
