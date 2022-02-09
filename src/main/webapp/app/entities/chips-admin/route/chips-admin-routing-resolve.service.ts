import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChipsAdmin, ChipsAdmin } from '../chips-admin.model';
import { ChipsAdminService } from '../service/chips-admin.service';

@Injectable({ providedIn: 'root' })
export class ChipsAdminRoutingResolveService implements Resolve<IChipsAdmin> {
  constructor(protected service: ChipsAdminService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChipsAdmin> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chipsAdmin: HttpResponse<ChipsAdmin>) => {
          if (chipsAdmin.body) {
            return of(chipsAdmin.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChipsAdmin());
  }
}
