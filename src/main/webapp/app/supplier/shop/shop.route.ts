import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, Routes } from "@angular/router";
import { Authority } from "app/config/authority.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { ShopService } from "app/entities/shop/service/shop.service";
import { IShop, Shop } from "app/entities/shop/shop.model";
import { Observable, of, EMPTY } from "rxjs";
import { flatMap } from "rxjs/operators";
import { ShopEditComponent } from "./shop-edit.component";
import { ShopOverviewComponent } from "./shop-overview.component";


@Injectable({ providedIn: 'root' })
export class ShopResolve implements Resolve<IShop> {
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

export const shopRoute: Routes = [
  {
    path: ':id/overview',
    component: ShopOverviewComponent,
    resolve: {
      shop: ShopResolve
    },
    data: {
      pageTitle: 'pagetitle.shop.overview'
    }
  },
  {
    path: ':id/edit',
    component: ShopEditComponent,
    resolve: {
      shop: ShopResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'pagetitle.shop.edit'
    },
    canActivate: [UserRouteAccessService]
  }
];
