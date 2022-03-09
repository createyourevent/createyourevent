import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISlotListPlum, SlotListPlum } from '../slot-list-plum.model';
import { SlotListPlumService } from '../service/slot-list-plum.service';

@Injectable({ providedIn: 'root' })
export class SlotListPlumRoutingResolveService implements Resolve<ISlotListPlum> {
  constructor(protected service: SlotListPlumService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISlotListPlum> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((slotListPlum: HttpResponse<SlotListPlum>) => {
          if (slotListPlum.body) {
            return of(slotListPlum.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SlotListPlum());
  }
}
