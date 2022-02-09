import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMp3, Mp3 } from '../mp-3.model';
import { Mp3Service } from '../service/mp-3.service';

@Injectable({ providedIn: 'root' })
export class Mp3RoutingResolveService implements Resolve<IMp3> {
  constructor(protected service: Mp3Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMp3> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mp3: HttpResponse<Mp3>) => {
          if (mp3.body) {
            return of(mp3.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Mp3());
  }
}
