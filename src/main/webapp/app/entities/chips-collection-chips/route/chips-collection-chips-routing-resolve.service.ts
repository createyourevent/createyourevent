import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChipsCollectionChips, ChipsCollectionChips } from '../chips-collection-chips.model';
import { ChipsCollectionChipsService } from '../service/chips-collection-chips.service';

@Injectable({ providedIn: 'root' })
export class ChipsCollectionChipsRoutingResolveService implements Resolve<IChipsCollectionChips> {
  constructor(protected service: ChipsCollectionChipsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChipsCollectionChips> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chipsCollectionChips: HttpResponse<ChipsCollectionChips>) => {
          if (chipsCollectionChips.body) {
            return of(chipsCollectionChips.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChipsCollectionChips());
  }
}
