import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceMap, ServiceMap } from '../service-map.model';
import { ServiceMapService } from '../service/service-map.service';

@Injectable({ providedIn: 'root' })
export class ServiceMapRoutingResolveService implements Resolve<IServiceMap> {
  constructor(protected service: ServiceMapService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceMap> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serviceMap: HttpResponse<ServiceMap>) => {
          if (serviceMap.body) {
            return of(serviceMap.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ServiceMap());
  }
}
