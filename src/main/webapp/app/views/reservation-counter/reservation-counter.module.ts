import { ReservationCounterComponent } from './reservation-counter.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [ReservationCounterComponent],
  exports: [ReservationCounterComponent]
})
export class ReservationCounterModule {}
