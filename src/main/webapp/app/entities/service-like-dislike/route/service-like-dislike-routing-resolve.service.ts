import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceLikeDislike, ServiceLikeDislike } from '../service-like-dislike.model';
import { ServiceLikeDislikeService } from '../service/service-like-dislike.service';

@Injectable({ providedIn: 'root' })
export class ServiceLikeDislikeRoutingResolveService implements Resolve<IServiceLikeDislike> {
  constructor(protected service: ServiceLikeDislikeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceLikeDislike> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serviceLikeDislike: HttpResponse<ServiceLikeDislike>) => {
          if (serviceLikeDislike.body) {
            return of(serviceLikeDislike.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ServiceLikeDislike());
  }
}
