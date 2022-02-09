import { Routes } from "@angular/router";
import { Authority } from "app/config/authority.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { RegisterShopComponent } from "./register-shop.component";


export const RegisterShopRoute: Routes = [
  {
    path: '',
    component: RegisterShopComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'register-shop.register'
    },
    canActivate: [UserRouteAccessService]
  }
];
