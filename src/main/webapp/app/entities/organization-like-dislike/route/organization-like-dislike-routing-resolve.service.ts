import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganizationLikeDislike, OrganizationLikeDislike } from '../organization-like-dislike.model';
import { OrganizationLikeDislikeService } from '../service/organization-like-dislike.service';

@Injectable({ providedIn: 'root' })
export class OrganizationLikeDislikeRoutingResolveService implements Resolve<IOrganizationLikeDislike> {
  constructor(protected service: OrganizationLikeDislikeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationLikeDislike> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationLikeDislike: HttpResponse<OrganizationLikeDislike>) => {
          if (organizationLikeDislike.body) {
            return of(organizationLikeDislike.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrganizationLikeDislike());
  }
}
