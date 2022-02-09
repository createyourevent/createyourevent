import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventComment, EventComment } from '../event-comment.model';
import { EventCommentService } from '../service/event-comment.service';

@Injectable({ providedIn: 'root' })
export class EventCommentRoutingResolveService implements Resolve<IEventComment> {
  constructor(protected service: EventCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventComment: HttpResponse<EventComment>) => {
          if (eventComment.body) {
            return of(eventComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventComment());
  }
}
