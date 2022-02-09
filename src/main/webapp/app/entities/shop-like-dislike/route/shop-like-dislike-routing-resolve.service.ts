import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShopLikeDislike, ShopLikeDislike } from '../shop-like-dislike.model';
import { ShopLikeDislikeService } from '../service/shop-like-dislike.service';

@Injectable({ providedIn: 'root' })
export class ShopLikeDislikeRoutingResolveService implements Resolve<IShopLikeDislike> {
  constructor(protected service: ShopLikeDislikeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShopLikeDislike> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shopLikeDislike: HttpResponse<ShopLikeDislike>) => {
          if (shopLikeDislike.body) {
            return of(shopLikeDislike.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ShopLikeDislike());
  }
}
