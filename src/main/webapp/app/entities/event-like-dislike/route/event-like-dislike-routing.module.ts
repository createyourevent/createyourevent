import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventLikeDislikeComponent } from '../list/event-like-dislike.component';
import { EventLikeDislikeDetailComponent } from '../detail/event-like-dislike-detail.component';
import { EventLikeDislikeUpdateComponent } from '../update/event-like-dislike-update.component';
import { EventLikeDislikeRoutingResolveService } from './event-like-dislike-routing-resolve.service';

const eventLikeDislikeRoute: Routes = [
  {
    path: '',
    component: EventLikeDislikeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventLikeDislikeDetailComponent,
    resolve: {
      eventLikeDislike: EventLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventLikeDislikeUpdateComponent,
    resolve: {
      eventLikeDislike: EventLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventLikeDislikeUpdateComponent,
    resolve: {
      eventLikeDislike: EventLikeDislikeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventLikeDislikeRoute)],
  exports: [RouterModule],
})
export class EventLikeDislikeRoutingModule {}
