import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISlotListOrange, SlotListOrange } from '../slot-list-orange.model';
import { SlotListOrangeService } from '../service/slot-list-orange.service';

@Injectable({ providedIn: 'root' })
export class SlotListOrangeRoutingResolveService implements Resolve<ISlotListOrange> {
  constructor(protected service: SlotListOrangeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISlotListOrange> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((slotListOrange: HttpResponse<SlotListOrange>) => {
          if (slotListOrange.body) {
            return of(slotListOrange.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SlotListOrange());
  }
}
