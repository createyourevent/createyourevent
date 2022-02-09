import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventProductOrder, EventProductOrder } from '../event-product-order.model';
import { EventProductOrderService } from '../service/event-product-order.service';

@Injectable({ providedIn: 'root' })
export class EventProductOrderRoutingResolveService implements Resolve<IEventProductOrder> {
  constructor(protected service: EventProductOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventProductOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventProductOrder: HttpResponse<EventProductOrder>) => {
          if (eventProductOrder.body) {
            return of(eventProductOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventProductOrder());
  }
}
