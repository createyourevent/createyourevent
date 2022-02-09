import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, Routes } from "@angular/router";
import { IProduct, Product } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { JhiResolvePagingParams } from "ng-jhipster";
import { Observable, of, EMPTY } from "rxjs";
import { flatMap } from "rxjs/operators";
import { DashboardOrganisatorComponent } from "./dashboard_organisator.component";

@Injectable({ providedIn: 'root' })
export class ProductIdResolve implements Resolve<IProduct> {
  constructor(private service: ProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProduct> | Observable<never> {
    const id = route.params['productId'];
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

export const DashboardRoute: Routes = [
  {
    path: '',
    component: DashboardOrganisatorComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      pageTitle: 'routes.title.dashboard.organisator'
    }
  }
];
