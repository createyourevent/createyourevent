import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRideCosts, RideCosts } from '../ride-costs.model';
import { RideCostsService } from '../service/ride-costs.service';

@Injectable({ providedIn: 'root' })
export class RideCostsRoutingResolveService implements Resolve<IRideCosts> {
  constructor(protected service: RideCostsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRideCosts> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rideCosts: HttpResponse<RideCosts>) => {
          if (rideCosts.body) {
            return of(rideCosts.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RideCosts());
  }
}
