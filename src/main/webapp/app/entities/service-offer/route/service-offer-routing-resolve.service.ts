import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceOffer, ServiceOffer } from '../service-offer.model';
import { ServiceOfferService } from '../service/service-offer.service';

@Injectable({ providedIn: 'root' })
export class ServiceOfferRoutingResolveService implements Resolve<IServiceOffer> {
  constructor(protected service: ServiceOfferService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceOffer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serviceOffer: HttpResponse<ServiceOffer>) => {
          if (serviceOffer.body) {
            return of(serviceOffer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ServiceOffer());
  }
}
