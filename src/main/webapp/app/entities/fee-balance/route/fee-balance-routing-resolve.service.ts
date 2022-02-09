import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFeeBalance, FeeBalance } from '../fee-balance.model';
import { FeeBalanceService } from '../service/fee-balance.service';

@Injectable({ providedIn: 'root' })
export class FeeBalanceRoutingResolveService implements Resolve<IFeeBalance> {
  constructor(protected service: FeeBalanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFeeBalance> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((feeBalance: HttpResponse<FeeBalance>) => {
          if (feeBalance.body) {
            return of(feeBalance.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FeeBalance());
  }
}
