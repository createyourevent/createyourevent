import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductStarRating, ProductStarRating } from '../product-star-rating.model';
import { ProductStarRatingService } from '../service/product-star-rating.service';

@Injectable({ providedIn: 'root' })
export class ProductStarRatingRoutingResolveService implements Resolve<IProductStarRating> {
  constructor(protected service: ProductStarRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductStarRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productStarRating: HttpResponse<ProductStarRating>) => {
          if (productStarRating.body) {
            return of(productStarRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductStarRating());
  }
}
