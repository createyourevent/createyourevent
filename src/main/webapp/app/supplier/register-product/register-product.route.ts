import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, Routes } from "@angular/router";
import { Authority } from "app/config/authority.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { IProduct, Product } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { Observable, of, EMPTY } from "rxjs";
import { flatMap } from "rxjs/operators";
import { AddProductComponent } from "./add-product.component";
import { OverviewProductComponent } from "./overview-product.component";
import { RegisterProductComponent } from "./register-product.component";
import { UpdateProductComponent } from "./update-product.component";


@Injectable({ providedIn: 'root' })
export class AddProductResolve implements Resolve<IProduct> {
  constructor(private service: ProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProduct> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((product: HttpResponse<Product>) => {
          if (product.body) {
            return of(product.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Product());
  }
}

export const RegisterProductRoute: Routes = [
  {
    path: '',
    component: RegisterProductComponent,
    data: {
      authorities: [Authority.SUPPLIER],
      pageTitle: 'register-product.register-product'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':shopId/addProduct',
    component: AddProductComponent,
    data: {
      authorities: [Authority.SUPPLIER],
      pageTitle: 'register-product.addProduct'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/updateProduct',
    component: UpdateProductComponent,
    resolve: {
      product: AddProductResolve
    },
    data: {
      authorities: [Authority.SUPPLIER],
      pageTitle: 'register-product.updateProduct'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/overviewProduct',
    component: OverviewProductComponent,
    data: {
      authorities: [Authority.SUPPLIER],
      pageTitle: 'register-product.overviewProduct'
    },
    canActivate: [UserRouteAccessService]
  }
];
