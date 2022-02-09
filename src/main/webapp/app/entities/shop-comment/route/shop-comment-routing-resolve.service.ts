import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShopComment, ShopComment } from '../shop-comment.model';
import { ShopCommentService } from '../service/shop-comment.service';

@Injectable({ providedIn: 'root' })
export class ShopCommentRoutingResolveService implements Resolve<IShopComment> {
  constructor(protected service: ShopCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShopComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shopComment: HttpResponse<ShopComment>) => {
          if (shopComment.body) {
            return of(shopComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ShopComment());
  }
}
