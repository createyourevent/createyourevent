import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, Routes } from "@angular/router";
import { Authority } from "app/config/authority.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { ShopService } from "app/entities/shop/service/shop.service";
import { IShop, Shop } from "app/entities/shop/shop.model";
import { AddProductComponent } from "app/views/event/add-product.component";
import { JhiResolvePagingParams } from "ng-jhipster";
import { Observable, of, EMPTY } from "rxjs";
import { flatMap } from "rxjs/operators";
import { OverviewProductComponent } from "../register-product/overview-product.component";
import { AddProductResolve } from "../register-product/register-product.route";
import { UpdateProductComponent } from "../register-product/update-product.component";
import { DashboardComponent } from "./dashboard.component";


@Injectable({ providedIn: 'root' })
export class AddShopResolve implements Resolve<IShop> {
  constructor(private service: ShopService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShop> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((shop: HttpResponse<Shop>) => {
          if (shop.body) {
            return of(shop.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Shop());
  }
}

export const DashboardRoute: Routes = [
  {
    path: '',
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    component: DashboardComponent,
    data: {
      authorities: [Authority.SUPPLIER],
      defaultSort: 'id,asc',
      pageTitle: 'global.menu.supplier.dashboard'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':shopId/addProduct',
    component: AddProductComponent,
    data: {
      authorities: [Authority.SUPPLIER],
      pageTitle: 'global.menu.supplier.add-product'
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
      pageTitle: 'global.menu.supplier.add-product'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/overviewProduct',
    component: OverviewProductComponent,
    data: {
      authorities: [Authority.SUPPLIER],
      pageTitle: 'global.menu.supplier.add-product'
    },
    canActivate: [UserRouteAccessService]
  }
];
