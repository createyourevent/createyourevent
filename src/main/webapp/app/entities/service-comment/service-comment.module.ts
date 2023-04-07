import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceCommentComponent } from './list/service-comment.component';
import { ServiceCommentDetailComponent } from './detail/service-comment-detail.component';
import { ServiceCommentUpdateComponent } from './update/service-comment-update.component';
import { ServiceCommentDeleteDialogComponent } from './delete/service-comment-delete-dialog.component';
import { ServiceCommentRoutingModule } from './route/service-comment-routing.module';

@NgModule({
  imports: [SharedModule, ServiceCommentRoutingModule],
  declarations: [
    ServiceCommentComponent,
    ServiceCommentDetailComponent,
    ServiceCommentUpdateComponent,
    ServiceCommentDeleteDialogComponent,
  ],
})
export class ServiceCommentModule {}
