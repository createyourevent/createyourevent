import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { STREAM_ROUTE } from './stream.route';
import { StreamComponent } from './stream.component';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { MzdTimelineModule } from 'ngx-rend-timeline';


@NgModule({
  imports: [SharedModule, RouterModule.forChild(STREAM_ROUTE), TabViewModule, CardModule, MzdTimelineModule, MatCardModule, ButtonModule],
  declarations: [StreamComponent]
})
export class StreamModule {}
