import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGift, Gift } from '../gift.model';
import { GiftService } from '../service/gift.service';

@Injectable({ providedIn: 'root' })
export class GiftRoutingResolveService implements Resolve<IGift> {
  constructor(protected service: GiftService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGift> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gift: HttpResponse<Gift>) => {
          if (gift.body) {
            return of(gift.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Gift());
  }
}
