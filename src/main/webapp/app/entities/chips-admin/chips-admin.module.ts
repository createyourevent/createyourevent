import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChipsAdminComponent } from './list/chips-admin.component';
import { ChipsAdminDetailComponent } from './detail/chips-admin-detail.component';
import { ChipsAdminUpdateComponent } from './update/chips-admin-update.component';
import { ChipsAdminDeleteDialogComponent } from './delete/chips-admin-delete-dialog.component';
import { ChipsAdminRoutingModule } from './route/chips-admin-routing.module';

@NgModule({
  imports: [SharedModule, ChipsAdminRoutingModule],
  declarations: [ChipsAdminComponent, ChipsAdminDetailComponent, ChipsAdminUpdateComponent, ChipsAdminDeleteDialogComponent],
  entryComponents: [ChipsAdminDeleteDialogComponent],
})
export class ChipsAdminModule {}
