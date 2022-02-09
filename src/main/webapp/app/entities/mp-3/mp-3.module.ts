import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Mp3Component } from './list/mp-3.component';
import { Mp3DetailComponent } from './detail/mp-3-detail.component';
import { Mp3UpdateComponent } from './update/mp-3-update.component';
import { Mp3DeleteDialogComponent } from './delete/mp-3-delete-dialog.component';
import { Mp3RoutingModule } from './route/mp-3-routing.module';

@NgModule({
  imports: [SharedModule, Mp3RoutingModule],
  declarations: [Mp3Component, Mp3DetailComponent, Mp3UpdateComponent, Mp3DeleteDialogComponent],
  entryComponents: [Mp3DeleteDialogComponent],
})
export class Mp3Module {}
