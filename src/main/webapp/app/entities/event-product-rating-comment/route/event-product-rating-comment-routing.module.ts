import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventProductRatingCommentComponent } from '../list/event-product-rating-comment.component';
import { EventProductRatingCommentDetailComponent } from '../detail/event-product-rating-comment-detail.component';
import { EventProductRatingCommentUpdateComponent } from '../update/event-product-rating-comment-update.component';
import { EventProductRatingCommentRoutingResolveService } from './event-product-rating-comment-routing-resolve.service';

const eventProductRatingCommentRoute: Routes = [
  {
    path: '',
    component: EventProductRatingCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventProductRatingCommentDetailComponent,
    resolve: {
      eventProductRatingComment: EventProductRatingCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventProductRatingCommentUpdateComponent,
    resolve: {
      eventProductRatingComment: EventProductRatingCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventProductRatingCommentUpdateComponent,
    resolve: {
      eventProductRatingComment: EventProductRatingCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventProductRatingCommentRoute)],
  exports: [RouterModule],
})
export class EventProductRatingCommentRoutingModule {}
