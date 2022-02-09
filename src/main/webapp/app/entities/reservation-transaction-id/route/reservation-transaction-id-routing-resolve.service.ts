import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReservationTransactionId, ReservationTransactionId } from '../reservation-transaction-id.model';
import { ReservationTransactionIdService } from '../service/reservation-transaction-id.service';

@Injectable({ providedIn: 'root' })
export class ReservationTransactionIdRoutingResolveService implements Resolve<IReservationTransactionId> {
  constructor(protected service: ReservationTransactionIdService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReservationTransactionId> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reservationTransactionId: HttpResponse<ReservationTransactionId>) => {
          if (reservationTransactionId.body) {
            return of(reservationTransactionId.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ReservationTransactionId());
  }
}
