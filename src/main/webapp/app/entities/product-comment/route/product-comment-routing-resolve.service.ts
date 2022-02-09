import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductComment, ProductComment } from '../product-comment.model';
import { ProductCommentService } from '../service/product-comment.service';

@Injectable({ providedIn: 'root' })
export class ProductCommentRoutingResolveService implements Resolve<IProductComment> {
  constructor(protected service: ProductCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productComment: HttpResponse<ProductComment>) => {
          if (productComment.body) {
            return of(productComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductComment());
  }
}
