import { Routes, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { CreateEventComponent } from './create-event.component';
import { OverviewComponent } from './overview.component';
import { FlyerComponent } from './flyer.component';
import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SelectProductsComponent } from './select-products.component';
import { SelectServicesComponent } from './select-services.component';
import { ProductsServicesComponent } from './products-services/products-services.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Injectable({ providedIn: 'root' })
export class ProductDetailResolve implements Resolve<IProduct> {
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

export const CreateEventRoute: Routes = [
  {
    path: '',
    component: CreateEventComponent,
    data: {
      authorities: [Authority.ORGANISATOR],
      pageTitle: 'routes.title.create-event'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'flyer',
    component: FlyerComponent,
    data: {
      authorities: [Authority.ORGANISATOR],
      pageTitle: 'routes.title.flyer'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'products-services',
    component: ProductsServicesComponent,
    data: {
      authorities: [Authority.ORGANISATOR],
      pageTitle: 'routes.title.select-items'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'select-products',
    component: SelectProductsComponent,
    data: {
      authorities: [Authority.ORGANISATOR],
      pageTitle: 'routes.title.select-items'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'select-services',
    component: SelectServicesComponent,
    data: {
      authorities: [Authority.ORGANISATOR],
      pageTitle: 'routes.title.select-services'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'overview',
    component: OverviewComponent,
    data: {
      authorities: [Authority.ORGANISATOR],
      pageTitle: 'routes.title.overview'
    },
    canActivate: [UserRouteAccessService]
  }
];
