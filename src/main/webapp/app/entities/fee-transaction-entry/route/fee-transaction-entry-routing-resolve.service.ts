import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFeeTransactionEntry, FeeTransactionEntry } from '../fee-transaction-entry.model';
import { FeeTransactionEntryService } from '../service/fee-transaction-entry.service';

@Injectable({ providedIn: 'root' })
export class FeeTransactionEntryRoutingResolveService implements Resolve<IFeeTransactionEntry> {
  constructor(protected service: FeeTransactionEntryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFeeTransactionEntry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((feeTransactionEntry: HttpResponse<FeeTransactionEntry>) => {
          if (feeTransactionEntry.body) {
            return of(feeTransactionEntry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FeeTransactionEntry());
  }
}
