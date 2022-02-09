import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EventStatus } from "app/entities/enumerations/event-status.model";
import { EventService } from "app/entities/event/service/event.service";
import { IReservation } from "app/entities/reservation/reservation.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";




@Component({
  selector: 'jhi-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  user: IUser;
  reservationsBilled: IReservation[] = [];
  reservationsNotBilled: IReservation[] = [];

  constructor(private generalService: GeneralService,
              private router: Router,
              private eventService: EventService) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;

      this.generalService.getReservationsByUserAndNotBilled(this.user.id).subscribe(r => {
        const reservations = r.body;
        reservations.forEach(reservation => {
          if(reservation.event.definitelyConfirmed === true && reservation.event.status === EventStatus.DEFINITELY) {
            this.eventService.find(reservation.event.id).subscribe(e => {
              reservation.event = e.body;
              this.reservationsNotBilled.push(reservation);
            });
          }
        });
      });
      this.generalService.getReservationsByUserAndBilled(this.user.id).subscribe(rb => {
        const reservationsBilled = rb.body;
        this.reservationsBilled = reservationsBilled;
        /*
        reservationsBilled.forEach(reservation => {
          if(reservation.transactionId.transactionDepositId === null && reservation.transactionId.transactionId !== null) {
            this.eventService.find(reservation.event.id).subscribe(e => {
              reservation.event = e.body;
              this.reservationsBilled.push(reservation);
            });
          } else if(reservation.event.definitelyConfirmed === true && reservation.event.status === EventStatus.DEFINITELY) {
            this.eventService.find(reservation.event.id).subscribe(e => {
              reservation.event = e.body;
              this.reservationsBilled.push(reservation);
            });
          }
        });
        */
      });
    });
  }

  pay(reservationId: number): void {
    this.router.navigate(['/account/tickets/' + reservationId + '/payTicket']);
  }
}
