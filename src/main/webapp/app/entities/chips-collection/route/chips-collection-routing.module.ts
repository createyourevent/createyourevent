import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChipsCollectionComponent } from '../list/chips-collection.component';
import { ChipsCollectionDetailComponent } from '../detail/chips-collection-detail.component';
import { ChipsCollectionUpdateComponent } from '../update/chips-collection-update.component';
import { ChipsCollectionRoutingResolveService } from './chips-collection-routing-resolve.service';

const chipsCollectionRoute: Routes = [
  {
    path: '',
    component: ChipsCollectionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChipsCollectionDetailComponent,
    resolve: {
      chipsCollection: ChipsCollectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChipsCollectionUpdateComponent,
    resolve: {
      chipsCollection: ChipsCollectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChipsCollectionUpdateComponent,
    resolve: {
      chipsCollection: ChipsCollectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chipsCollectionRoute)],
  exports: [RouterModule],
})
export class ChipsCollectionRoutingModule {}
