import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChipsCollection, ChipsCollection } from '../chips-collection.model';
import { ChipsCollectionService } from '../service/chips-collection.service';

@Injectable({ providedIn: 'root' })
export class ChipsCollectionRoutingResolveService implements Resolve<IChipsCollection> {
  constructor(protected service: ChipsCollectionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChipsCollection> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chipsCollection: HttpResponse<ChipsCollection>) => {
          if (chipsCollection.body) {
            return of(chipsCollection.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChipsCollection());
  }
}
