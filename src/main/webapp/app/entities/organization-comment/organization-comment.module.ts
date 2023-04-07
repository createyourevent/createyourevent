import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationCommentComponent } from './list/organization-comment.component';
import { OrganizationCommentDetailComponent } from './detail/organization-comment-detail.component';
import { OrganizationCommentUpdateComponent } from './update/organization-comment-update.component';
import { OrganizationCommentDeleteDialogComponent } from './delete/organization-comment-delete-dialog.component';
import { OrganizationCommentRoutingModule } from './route/organization-comment-routing.module';

@NgModule({
  imports: [SharedModule, OrganizationCommentRoutingModule],
  declarations: [
    OrganizationCommentComponent,
    OrganizationCommentDetailComponent,
    OrganizationCommentUpdateComponent,
    OrganizationCommentDeleteDialogComponent,
  ],
})
export class OrganizationCommentModule {}
