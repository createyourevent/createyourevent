import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreateYourEventService, CreateYourEventService } from '../create-your-event-service.model';
import { CreateYourEventServiceService } from '../service/create-your-event-service.service';

@Injectable({ providedIn: 'root' })
export class CreateYourEventServiceRoutingResolveService implements Resolve<ICreateYourEventService> {
  constructor(protected service: CreateYourEventServiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreateYourEventService> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((createYourEventService: HttpResponse<CreateYourEventService>) => {
          if (createYourEventService.body) {
            return of(createYourEventService.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CreateYourEventService());
  }
}
