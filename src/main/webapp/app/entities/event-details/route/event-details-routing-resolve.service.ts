import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventDetails, EventDetails } from '../event-details.model';
import { EventDetailsService } from '../service/event-details.service';

@Injectable({ providedIn: 'root' })
export class EventDetailsRoutingResolveService implements Resolve<IEventDetails> {
  constructor(protected service: EventDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventDetails: HttpResponse<EventDetails>) => {
          if (eventDetails.body) {
            return of(eventDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventDetails());
  }
}
