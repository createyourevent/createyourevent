import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChips, Chips } from '../chips.model';
import { ChipsService } from '../service/chips.service';

@Injectable({ providedIn: 'root' })
export class ChipsRoutingResolveService implements Resolve<IChips> {
  constructor(protected service: ChipsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChips> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chips: HttpResponse<Chips>) => {
          if (chips.body) {
            return of(chips.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Chips());
  }
}
