import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductCommentComponent } from '../list/product-comment.component';
import { ProductCommentDetailComponent } from '../detail/product-comment-detail.component';
import { ProductCommentUpdateComponent } from '../update/product-comment-update.component';
import { ProductCommentRoutingResolveService } from './product-comment-routing-resolve.service';

const productCommentRoute: Routes = [
  {
    path: '',
    component: ProductCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductCommentDetailComponent,
    resolve: {
      productComment: ProductCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductCommentUpdateComponent,
    resolve: {
      productComment: ProductCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductCommentUpdateComponent,
    resolve: {
      productComment: ProductCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productCommentRoute)],
  exports: [RouterModule],
})
export class ProductCommentRoutingModule {}
