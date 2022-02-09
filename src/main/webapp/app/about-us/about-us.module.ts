import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { MzdTimelineModule } from 'ngx-rend-timeline';
import { ABOUT_US_ROUTE } from './about-us.route';
import { AboutUsComponent } from './about-us.component';
import { OrganizationChartModule } from 'primeng/organizationchart';


@NgModule({
  imports: [SharedModule, RouterModule.forChild(ABOUT_US_ROUTE), TabViewModule, CardModule, MzdTimelineModule, MatCardModule, ButtonModule, OrganizationChartModule],
  declarations: [AboutUsComponent],
  exports: [RouterModule]

})

export class AboutUsModule {}
