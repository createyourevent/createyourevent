import { Component, OnInit } from '@angular/core';
import { IEvent } from 'app/entities/event/event.model';
import { IReservation, Reservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';
import { IUser } from 'app/entities/user/user.model';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'jhi-buy-ticket-datatrans',
  templateUrl: './buy-ticket-datatrans.component.html',
  styleUrls: ['./buy-ticket-datatrans.component.scss'],
  providers: [DialogService]
})
export class BuyTicketDatatransComponent implements OnInit {

  event: IEvent;
  user: IUser;

  type: string;
  id: number;

  amount: number;

  constructor(public reservationService: ReservationService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

   ngOnInit(): void {
    this.event = this.config.data.event;
    this.user = this.config.data.user;
    this.type = this.config.data.type;
    this.id = this.config.data.id;
    this.amount = this.config.data.amount;
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
