import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuckySpinComponent } from './luckySpin.component';
import { NgxWheelModule } from 'ngx-wheel';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgxWheelModule,
    SharedModule
  ],
  declarations: [LuckySpinComponent],
  exports: [LuckySpinComponent]
})
export class LuckySpinModule { }
