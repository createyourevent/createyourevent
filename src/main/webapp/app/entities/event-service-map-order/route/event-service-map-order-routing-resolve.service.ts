import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventServiceMapOrder, EventServiceMapOrder } from '../event-service-map-order.model';
import { EventServiceMapOrderService } from '../service/event-service-map-order.service';

@Injectable({ providedIn: 'root' })
export class EventServiceMapOrderRoutingResolveService implements Resolve<IEventServiceMapOrder> {
  constructor(protected service: EventServiceMapOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventServiceMapOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventServiceMapOrder: HttpResponse<EventServiceMapOrder>) => {
          if (eventServiceMapOrder.body) {
            return of(eventServiceMapOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventServiceMapOrder());
  }
}
