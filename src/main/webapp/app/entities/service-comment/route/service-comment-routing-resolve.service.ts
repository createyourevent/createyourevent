import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceComment, ServiceComment } from '../service-comment.model';
import { ServiceCommentService } from '../service/service-comment.service';

@Injectable({ providedIn: 'root' })
export class ServiceCommentRoutingResolveService implements Resolve<IServiceComment> {
  constructor(protected service: ServiceCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serviceComment: HttpResponse<ServiceComment>) => {
          if (serviceComment.body) {
            return of(serviceComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ServiceComment());
  }
}
