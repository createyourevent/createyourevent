import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISlotListClock, SlotListClock } from '../slot-list-clock.model';
import { SlotListClockService } from '../service/slot-list-clock.service';

@Injectable({ providedIn: 'root' })
export class SlotListClockRoutingResolveService implements Resolve<ISlotListClock> {
  constructor(protected service: SlotListClockService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISlotListClock> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((slotListClock: HttpResponse<SlotListClock>) => {
          if (slotListClock.body) {
            return of(slotListClock.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SlotListClock());
  }
}
