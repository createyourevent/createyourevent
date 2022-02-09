import { OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import {Component, Input} from '@angular/core';
import { IEvent } from 'app/entities/event/event.model';
import { IReservation, Reservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';
import { IUser } from 'app/entities/user/user.model';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
    templateUrl: './event-payment-dialog.component.html',
    providers: [DialogService]
})
export class EventPaymentDialogComponent {

    event: IEvent;
    user: IUser;

    type: string;
    id: number;



    constructor(public reservationService: ReservationService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
      this.event = this.config.data.event;
      this.user = this.config.data.user;
      this.type = this.config.data.type;
      this.id = this.config.data.id;
    }

    genround(amt: number, prec: number): number {
      var rndd = Number((Math.round(amt / prec) * prec).toFixed(2));
      return rndd ;
    }

    onApproveAngular(data:any): void {
      const reservation: IReservation = new Reservation();
      reservation.event = this.event;
      reservation.user = this.user;
      this.reservationService.create(reservation).subscribe(() => {
        this.ref.close(reservation);
      });
    }

}
