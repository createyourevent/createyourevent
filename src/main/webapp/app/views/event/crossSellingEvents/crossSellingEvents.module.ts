import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossSellingEventsComponent } from './crossSellingEvents.component';
import { SharedModule } from 'app/shared/shared.module';
import { DataViewModule } from 'primeng/dataview';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, DataViewModule, SharedModule, NgbModule],
  declarations: [CrossSellingEventsComponent],
  exports: [CrossSellingEventsComponent]
})
export class CrossSellingEventsModule {}
