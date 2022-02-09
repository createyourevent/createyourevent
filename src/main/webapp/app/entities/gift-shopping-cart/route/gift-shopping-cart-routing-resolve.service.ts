import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGiftShoppingCart, GiftShoppingCart } from '../gift-shopping-cart.model';
import { GiftShoppingCartService } from '../service/gift-shopping-cart.service';

@Injectable({ providedIn: 'root' })
export class GiftShoppingCartRoutingResolveService implements Resolve<IGiftShoppingCart> {
  constructor(protected service: GiftShoppingCartService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGiftShoppingCart> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((giftShoppingCart: HttpResponse<GiftShoppingCart>) => {
          if (giftShoppingCart.body) {
            return of(giftShoppingCart.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new GiftShoppingCart());
  }
}
