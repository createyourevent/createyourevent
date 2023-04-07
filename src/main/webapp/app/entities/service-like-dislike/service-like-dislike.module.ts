import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceLikeDislikeComponent } from './list/service-like-dislike.component';
import { ServiceLikeDislikeDetailComponent } from './detail/service-like-dislike-detail.component';
import { ServiceLikeDislikeUpdateComponent } from './update/service-like-dislike-update.component';
import { ServiceLikeDislikeDeleteDialogComponent } from './delete/service-like-dislike-delete-dialog.component';
import { ServiceLikeDislikeRoutingModule } from './route/service-like-dislike-routing.module';

@NgModule({
  imports: [SharedModule, ServiceLikeDislikeRoutingModule],
  declarations: [
    ServiceLikeDislikeComponent,
    ServiceLikeDislikeDetailComponent,
    ServiceLikeDislikeUpdateComponent,
    ServiceLikeDislikeDeleteDialogComponent,
  ],
})
export class ServiceLikeDislikeModule {}
