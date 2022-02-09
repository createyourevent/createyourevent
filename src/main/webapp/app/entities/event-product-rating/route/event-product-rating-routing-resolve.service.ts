import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventProductRating, EventProductRating } from '../event-product-rating.model';
import { EventProductRatingService } from '../service/event-product-rating.service';

@Injectable({ providedIn: 'root' })
export class EventProductRatingRoutingResolveService implements Resolve<IEventProductRating> {
  constructor(protected service: EventProductRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventProductRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventProductRating: HttpResponse<EventProductRating>) => {
          if (eventProductRating.body) {
            return of(eventProductRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventProductRating());
  }
}
