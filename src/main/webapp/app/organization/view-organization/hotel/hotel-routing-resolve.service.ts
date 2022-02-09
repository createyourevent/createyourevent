import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IHotel, Hotel } from 'app/entities/hotel/hotel.model';
import { HotelService } from 'app/entities/hotel/service/hotel.service';


@Injectable({ providedIn: 'root' })
export class HotelRoutingResolveService implements Resolve<IHotel> {
  constructor(protected service: HotelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHotel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organization: HttpResponse<Hotel>) => {
          if (organization.body) {
            return of(organization.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Hotel());
  }
}
