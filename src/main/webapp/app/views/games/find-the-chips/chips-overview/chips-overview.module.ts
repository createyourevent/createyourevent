import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsOverviewComponent } from './chips-overview.component';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { ChipsOverviewRoutes } from './chips-overview.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CardModule,
    ChipsOverviewRoutes
  ],
  declarations: [ChipsOverviewComponent]
})
export class ChipsOverviewModule { }
