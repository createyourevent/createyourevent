import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IClub, Club } from 'app/entities/club/club.model';
import { ClubService } from 'app/entities/club/service/club.service';


@Injectable({ providedIn: 'root' })
export class ClubRoutingResolveService implements Resolve<IClub> {
  constructor(protected service: ClubService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClub> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organization: HttpResponse<Club>) => {
          if (organization.body) {
            return of(organization.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Club());
  }
}
