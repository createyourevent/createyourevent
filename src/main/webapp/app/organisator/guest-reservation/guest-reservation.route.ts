import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, Routes } from "@angular/router";
import { Authority } from "app/config/authority.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { IReservation, Reservation } from "app/entities/reservation/reservation.model";
import { ReservationService } from "app/entities/reservation/service/reservation.service";
import { Observable, of, EMPTY } from "rxjs";
import { flatMap } from "rxjs/operators";
import { GuestReservationDetailComponent } from "./guest-reservation-detail.component";
import { GuestReservationComponent } from "./guest-reservation.component";


@Injectable({ providedIn: 'root' })
export class GuestReservationResolve implements Resolve<IReservation> {
  constructor(private service: ReservationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReservation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((reservation: HttpResponse<Reservation>) => {
          if (reservation.body) {
            return of(reservation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Reservation());
  }
}

export const GUEST_RESERVATION_ROUTE: Routes = [
  {
    path: ':eventId/guest-reservation',
    component: GuestReservationComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.guest-reservation.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: GuestReservationDetailComponent,
    resolve: {
      reservation: GuestReservationResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'routes.guest-reservation.detail.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
