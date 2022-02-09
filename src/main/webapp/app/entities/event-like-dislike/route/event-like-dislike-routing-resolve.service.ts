import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventLikeDislike, EventLikeDislike } from '../event-like-dislike.model';
import { EventLikeDislikeService } from '../service/event-like-dislike.service';

@Injectable({ providedIn: 'root' })
export class EventLikeDislikeRoutingResolveService implements Resolve<IEventLikeDislike> {
  constructor(protected service: EventLikeDislikeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventLikeDislike> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventLikeDislike: HttpResponse<EventLikeDislike>) => {
          if (eventLikeDislike.body) {
            return of(eventLikeDislike.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventLikeDislike());
  }
}
