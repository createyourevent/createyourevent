import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductLikeDislike, ProductLikeDislike } from '../product-like-dislike.model';
import { ProductLikeDislikeService } from '../service/product-like-dislike.service';

@Injectable({ providedIn: 'root' })
export class ProductLikeDislikeRoutingResolveService implements Resolve<IProductLikeDislike> {
  constructor(protected service: ProductLikeDislikeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductLikeDislike> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productLikeDislike: HttpResponse<ProductLikeDislike>) => {
          if (productLikeDislike.body) {
            return of(productLikeDislike.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductLikeDislike());
  }
}
