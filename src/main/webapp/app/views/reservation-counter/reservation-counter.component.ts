import { Component, Input } from '@angular/core';

@Component({
  selector: 'jhi-reservation-counter',
  templateUrl: './reservation-counter.component.html',
  styleUrls: ['reservation-counter.component.scss']
})
export class ReservationCounterComponent {
  @Input() numberReservations!: number;
  @Input() maximumReservations!: number;
  @Input() previousEarnings!: number;
  @Input() minimumReservations: number;
  @Input() tickets: number;

  isMaximum(): boolean {
    if (this.numberReservations === this.maximumReservations) {
      return true;
    } else {
      return false;
    }
  }
}
