import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShopStarRating, ShopStarRating } from '../shop-star-rating.model';
import { ShopStarRatingService } from '../service/shop-star-rating.service';

@Injectable({ providedIn: 'root' })
export class ShopStarRatingRoutingResolveService implements Resolve<IShopStarRating> {
  constructor(protected service: ShopStarRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShopStarRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shopStarRating: HttpResponse<ShopStarRating>) => {
          if (shopStarRating.body) {
            return of(shopStarRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ShopStarRating());
  }
}
