import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, Routes } from "@angular/router";
import { Authority } from "app/config/authority.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { IProduct, Product } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { ProductUpdateComponent } from "app/entities/product/update/product-update.component";
import { Observable, of, EMPTY } from "rxjs";
import { flatMap } from "rxjs/operators";
import { DashboardSupplierComponent } from "./admin-dashboard-supplier/admin-dashboard-supplier.component";
import { ProductDetailComponent } from "./product-detail.component";


@Injectable({ providedIn: 'root' })
export class ProductsResolve implements Resolve<IProduct> {
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

export const productRoute: Routes = [
  {
    path: ':id/view',
    component: ProductDetailComponent,
    resolve: {
      product: ProductsResolve
    },
    data: {
      pageTitle: 'createyoureventApp.product.home.title'
    }
  },
  {
    path: 'new',
    component: ProductUpdateComponent,
    resolve: {
      product: ProductsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.product.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductUpdateComponent,
    resolve: {
      product: ProductsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.product.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':productId/dashboard-product',
    component: DashboardSupplierComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
