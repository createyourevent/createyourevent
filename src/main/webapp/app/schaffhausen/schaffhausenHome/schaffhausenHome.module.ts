import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchaffhausenHomeComponent } from './schaffhausenHome.component';
import { SchaffhausenHomeRoutes } from './schaffhausenHome.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [CommonModule, SchaffhausenHomeRoutes, SharedModule],
  declarations: [SchaffhausenHomeComponent]
})
export class SchaffhausenHomeModule {}
