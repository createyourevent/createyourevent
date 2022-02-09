import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPointsExchange, PointsExchange } from '../points-exchange.model';
import { PointsExchangeService } from '../service/points-exchange.service';

@Injectable({ providedIn: 'root' })
export class PointsExchangeRoutingResolveService implements Resolve<IPointsExchange> {
  constructor(protected service: PointsExchangeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPointsExchange> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pointsExchange: HttpResponse<PointsExchange>) => {
          if (pointsExchange.body) {
            return of(pointsExchange.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PointsExchange());
  }
}
