import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdminFeesPrice, AdminFeesPrice } from '../admin-fees-price.model';
import { AdminFeesPriceService } from '../service/admin-fees-price.service';

@Injectable({ providedIn: 'root' })
export class AdminFeesPriceRoutingResolveService implements Resolve<IAdminFeesPrice> {
  constructor(protected service: AdminFeesPriceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdminFeesPrice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((adminFeesPrice: HttpResponse<AdminFeesPrice>) => {
          if (adminFeesPrice.body) {
            return of(adminFeesPrice.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AdminFeesPrice());
  }
}
