import { Routes } from '@angular/router';
import { CalculationComponent } from './calculation/calculation.component';
import { CommentsComponent } from './comments/comments.component';
import { RatingsComponent } from './ratings/ratings.component';
import { GalleryComponent } from './gallery/gallery.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { StarRatingsComponent } from './star-ratings/star-ratings.component';
import { InFavoritsComponent } from './in-favorits/in-favorits.component';

export const DASHBOARD_EVENT_ROUTES: Routes = [
  { path: '/organisator/dashboard/calculation', component: CalculationComponent },
  { path: '/organisator/dashboard/comments', component: CommentsComponent },
  { path: '/organisator/dashboard/ratings', component: RatingsComponent },
  { path: '/organisator/dashboard/gallery', component: GalleryComponent },
  { path: '/organisator/dashboard/workflow', component: WorkflowComponent },
  { path: '/organisator/dashboard/stars', component: StarRatingsComponent },
  { path: '/events/:eventId/dashboard-event/inFavorits', component: InFavoritsComponent }
];
