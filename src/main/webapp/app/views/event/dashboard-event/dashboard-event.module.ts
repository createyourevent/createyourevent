import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DASHBOARD_EVENT_ROUTES } from './dashboard-event.route';
import { CYEEventModule } from '../event.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { WorkflowOrganisatorModule } from '../workflow-organisator/workflow-organisator.module';
import { AdminLikeDislikeModule } from 'app/views/ratings/like_dislike/admin_like_dislike/admin_like_dislike.module';
import { CommentBoxModule } from 'app/views/comment-box/comment-box.module';
import { TableModule } from 'primeng/table';
import { InFavoritsComponent } from './in-favorits/in-favorits.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(DASHBOARD_EVENT_ROUTES),
    CYEEventModule,
    MatToolbarModule,
    MatTabsModule,
    WorkflowOrganisatorModule,
    AdminLikeDislikeModule,
    CommentBoxModule,
    TableModule
  ],
  declarations: [],
})
export class DashboardEventModule {}
