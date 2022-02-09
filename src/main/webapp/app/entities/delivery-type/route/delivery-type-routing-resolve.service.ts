import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDeliveryType, DeliveryType } from '../delivery-type.model';
import { DeliveryTypeService } from '../service/delivery-type.service';

@Injectable({ providedIn: 'root' })
export class DeliveryTypeRoutingResolveService implements Resolve<IDeliveryType> {
  constructor(protected service: DeliveryTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDeliveryType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((deliveryType: HttpResponse<DeliveryType>) => {
          if (deliveryType.body) {
            return of(deliveryType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DeliveryType());
  }
}
