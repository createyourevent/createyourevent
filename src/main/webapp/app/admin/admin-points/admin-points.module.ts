import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPointsComponent } from './admin-points.component';
import { AdminPointsRoutes } from './admin-points.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [CommonModule, AdminPointsRoutes, SharedModule],
  declarations: [AdminPointsComponent]
})
export class AdminPointsModule {}
