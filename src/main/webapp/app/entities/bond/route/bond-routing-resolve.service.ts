import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBond, Bond } from '../bond.model';
import { BondService } from '../service/bond.service';

@Injectable({ providedIn: 'root' })
export class BondRoutingResolveService implements Resolve<IBond> {
  constructor(protected service: BondService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBond> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bond: HttpResponse<Bond>) => {
          if (bond.body) {
            return of(bond.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bond());
  }
}
