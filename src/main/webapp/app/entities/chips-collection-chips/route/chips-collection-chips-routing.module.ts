import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChipsCollectionChipsComponent } from '../list/chips-collection-chips.component';
import { ChipsCollectionChipsDetailComponent } from '../detail/chips-collection-chips-detail.component';
import { ChipsCollectionChipsUpdateComponent } from '../update/chips-collection-chips-update.component';
import { ChipsCollectionChipsRoutingResolveService } from './chips-collection-chips-routing-resolve.service';

const chipsCollectionChipsRoute: Routes = [
  {
    path: '',
    component: ChipsCollectionChipsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChipsCollectionChipsDetailComponent,
    resolve: {
      chipsCollectionChips: ChipsCollectionChipsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChipsCollectionChipsUpdateComponent,
    resolve: {
      chipsCollectionChips: ChipsCollectionChipsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChipsCollectionChipsUpdateComponent,
    resolve: {
      chipsCollectionChips: ChipsCollectionChipsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chipsCollectionChipsRoute)],
  exports: [RouterModule],
})
export class ChipsCollectionChipsRoutingModule {}
