import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'app/entities/event/service/event.service';
import { IReservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';


@Component({
  selector: 'jhi-pay-ticket',
  templateUrl: './payTicket.component.html',
  styleUrls: ['./payTicket.component.scss']
})
export class PayTicketComponent implements OnInit {

  reservation!: IReservation;
  successfullPayment = false;
  id: number;
  type: string;

  constructor(private reservationService: ReservationService,
              private route: ActivatedRoute,
              private eventService: EventService,
              protected router: Router) { }

  ngOnInit(): void {
    const resId = this.route.snapshot.params['reservationId'];
    this.id = Number(resId);
    this.type = 'ticket';
    this.reservationService.find(resId).subscribe(res => {
      this.reservation = res.body!;
      if(this.reservation.billed === true) {
        this.successfullPayment = true;
      }
      this.eventService.find(this.reservation.event.id).subscribe(e => {
        this.reservation.event = e.body;
      });
    });
  }

previousState(): void {
  this.router.navigate(['/account/tickets']);
}

genround(amt: number, prec: number): number {
  var rndd = Number((Math.round(amt / prec) * prec).toFixed(2));
  return rndd ;
}

}
