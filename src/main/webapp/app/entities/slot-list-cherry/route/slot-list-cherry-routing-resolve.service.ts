import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISlotListCherry, SlotListCherry } from '../slot-list-cherry.model';
import { SlotListCherryService } from '../service/slot-list-cherry.service';

@Injectable({ providedIn: 'root' })
export class SlotListCherryRoutingResolveService implements Resolve<ISlotListCherry> {
  constructor(protected service: SlotListCherryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISlotListCherry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((slotListCherry: HttpResponse<SlotListCherry>) => {
          if (slotListCherry.body) {
            return of(slotListCherry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SlotListCherry());
  }
}
