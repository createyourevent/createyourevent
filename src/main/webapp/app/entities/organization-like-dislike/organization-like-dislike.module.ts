import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationLikeDislikeComponent } from './list/organization-like-dislike.component';
import { OrganizationLikeDislikeDetailComponent } from './detail/organization-like-dislike-detail.component';
import { OrganizationLikeDislikeUpdateComponent } from './update/organization-like-dislike-update.component';
import { OrganizationLikeDislikeDeleteDialogComponent } from './delete/organization-like-dislike-delete-dialog.component';
import { OrganizationLikeDislikeRoutingModule } from './route/organization-like-dislike-routing.module';

@NgModule({
  imports: [SharedModule, OrganizationLikeDislikeRoutingModule],
  declarations: [
    OrganizationLikeDislikeComponent,
    OrganizationLikeDislikeDetailComponent,
    OrganizationLikeDislikeUpdateComponent,
    OrganizationLikeDislikeDeleteDialogComponent,
  ],
})
export class OrganizationLikeDislikeModule {}
