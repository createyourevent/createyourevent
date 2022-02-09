import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'app/entities/event/service/event.service';
import { IReservation, Reservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  type: string;
  id: number;
  datatransTrxId: string;
  user: IUser;


  constructor(
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private reservationService: ReservationService,
    protected router: Router,
    private eventService: EventService,
  ) { }

  ngOnInit(): void {
  }

  previousState(): void {
    window.history.back();
  }

}
