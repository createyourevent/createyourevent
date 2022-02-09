import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganizationReservation, OrganizationReservation } from '../organization-reservation.model';
import { OrganizationReservationService } from '../service/organization-reservation.service';

@Injectable({ providedIn: 'root' })
export class OrganizationReservationRoutingResolveService implements Resolve<IOrganizationReservation> {
  constructor(protected service: OrganizationReservationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationReservation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationReservation: HttpResponse<OrganizationReservation>) => {
          if (organizationReservation.body) {
            return of(organizationReservation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrganizationReservation());
  }
}
