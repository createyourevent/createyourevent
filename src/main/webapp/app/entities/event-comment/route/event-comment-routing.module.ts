import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventCommentComponent } from '../list/event-comment.component';
import { EventCommentDetailComponent } from '../detail/event-comment-detail.component';
import { EventCommentUpdateComponent } from '../update/event-comment-update.component';
import { EventCommentRoutingResolveService } from './event-comment-routing-resolve.service';

const eventCommentRoute: Routes = [
  {
    path: '',
    component: EventCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventCommentDetailComponent,
    resolve: {
      eventComment: EventCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventCommentUpdateComponent,
    resolve: {
      eventComment: EventCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventCommentUpdateComponent,
    resolve: {
      eventComment: EventCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventCommentRoute)],
  exports: [RouterModule],
})
export class EventCommentRoutingModule {}
