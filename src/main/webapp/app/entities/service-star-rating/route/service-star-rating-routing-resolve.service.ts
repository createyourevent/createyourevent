import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceStarRating, ServiceStarRating } from '../service-star-rating.model';
import { ServiceStarRatingService } from '../service/service-star-rating.service';

@Injectable({ providedIn: 'root' })
export class ServiceStarRatingRoutingResolveService implements Resolve<IServiceStarRating> {
  constructor(protected service: ServiceStarRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceStarRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serviceStarRating: HttpResponse<ServiceStarRating>) => {
          if (serviceStarRating.body) {
            return of(serviceStarRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ServiceStarRating());
  }
}
