import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventStarRating, EventStarRating } from '../event-star-rating.model';
import { EventStarRatingService } from '../service/event-star-rating.service';

@Injectable({ providedIn: 'root' })
export class EventStarRatingRoutingResolveService implements Resolve<IEventStarRating> {
  constructor(protected service: EventStarRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventStarRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventStarRating: HttpResponse<EventStarRating>) => {
          if (eventStarRating.body) {
            return of(eventStarRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventStarRating());
  }
}
