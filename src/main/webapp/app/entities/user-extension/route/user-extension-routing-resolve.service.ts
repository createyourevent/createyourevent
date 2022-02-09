import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserExtension, UserExtension } from '../user-extension.model';
import { UserExtensionService } from '../service/user-extension.service';

@Injectable({ providedIn: 'root' })
export class UserExtensionRoutingResolveService implements Resolve<IUserExtension> {
  constructor(protected service: UserExtensionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserExtension> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userExtension: HttpResponse<UserExtension>) => {
          if (userExtension.body) {
            return of(userExtension.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserExtension());
  }
}
