import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserExtensionComponent } from '../list/user-extension.component';
import { UserExtensionDetailComponent } from '../detail/user-extension-detail.component';
import { UserExtensionUpdateComponent } from '../update/user-extension-update.component';
import { UserExtensionRoutingResolveService } from './user-extension-routing-resolve.service';

const userExtensionRoute: Routes = [
  {
    path: '',
    component: UserExtensionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserExtensionDetailComponent,
    resolve: {
      userExtension: UserExtensionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserExtensionUpdateComponent,
    resolve: {
      userExtension: UserExtensionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserExtensionUpdateComponent,
    resolve: {
      userExtension: UserExtensionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userExtensionRoute)],
  exports: [RouterModule],
})
export class UserExtensionRoutingModule {}
