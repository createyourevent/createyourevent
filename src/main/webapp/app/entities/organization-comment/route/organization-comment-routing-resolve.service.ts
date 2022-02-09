import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganizationComment, OrganizationComment } from '../organization-comment.model';
import { OrganizationCommentService } from '../service/organization-comment.service';

@Injectable({ providedIn: 'root' })
export class OrganizationCommentRoutingResolveService implements Resolve<IOrganizationComment> {
  constructor(protected service: OrganizationCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationComment: HttpResponse<OrganizationComment>) => {
          if (organizationComment.body) {
            return of(organizationComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrganizationComment());
  }
}
