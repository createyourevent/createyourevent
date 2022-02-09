import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventProductRatingComment, EventProductRatingComment } from '../event-product-rating-comment.model';
import { EventProductRatingCommentService } from '../service/event-product-rating-comment.service';

@Injectable({ providedIn: 'root' })
export class EventProductRatingCommentRoutingResolveService implements Resolve<IEventProductRatingComment> {
  constructor(protected service: EventProductRatingCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventProductRatingComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventProductRatingComment: HttpResponse<EventProductRatingComment>) => {
          if (eventProductRatingComment.body) {
            return of(eventProductRatingComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventProductRatingComment());
  }
}
