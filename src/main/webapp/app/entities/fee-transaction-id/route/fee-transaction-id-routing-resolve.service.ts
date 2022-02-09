import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFeeTransactionId, FeeTransactionId } from '../fee-transaction-id.model';
import { FeeTransactionIdService } from '../service/fee-transaction-id.service';

@Injectable({ providedIn: 'root' })
export class FeeTransactionIdRoutingResolveService implements Resolve<IFeeTransactionId> {
  constructor(protected service: FeeTransactionIdService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFeeTransactionId> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((feeTransactionId: HttpResponse<FeeTransactionId>) => {
          if (feeTransactionId.body) {
            return of(feeTransactionId.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FeeTransactionId());
  }
}
