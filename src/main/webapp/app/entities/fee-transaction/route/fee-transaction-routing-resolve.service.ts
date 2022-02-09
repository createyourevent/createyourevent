import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFeeTransaction, FeeTransaction } from '../fee-transaction.model';
import { FeeTransactionService } from '../service/fee-transaction.service';

@Injectable({ providedIn: 'root' })
export class FeeTransactionRoutingResolveService implements Resolve<IFeeTransaction> {
  constructor(protected service: FeeTransactionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFeeTransaction> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((feeTransaction: HttpResponse<FeeTransaction>) => {
          if (feeTransaction.body) {
            return of(feeTransaction.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FeeTransaction());
  }
}
