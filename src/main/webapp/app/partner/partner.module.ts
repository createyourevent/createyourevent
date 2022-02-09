import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerComponent } from './partner.component';
import { SharedModule } from 'app/shared/shared.module';
import { PartnerRoutes } from './partner.routing';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
  imports: [CommonModule, SharedModule, PartnerRoutes, DataViewModule],
  declarations: [PartnerComponent]
})
export class PartnerModule {}
