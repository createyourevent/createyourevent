import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChipsComponent } from './list/chips.component';
import { ChipsDetailComponent } from './detail/chips-detail.component';
import { ChipsUpdateComponent } from './update/chips-update.component';
import { ChipsDeleteDialogComponent } from './delete/chips-delete-dialog.component';
import { ChipsRoutingModule } from './route/chips-routing.module';

@NgModule({
  imports: [SharedModule, ChipsRoutingModule],
  declarations: [ChipsComponent, ChipsDetailComponent, ChipsUpdateComponent, ChipsDeleteDialogComponent],
  entryComponents: [ChipsDeleteDialogComponent],
})
export class ChipsModule {}
