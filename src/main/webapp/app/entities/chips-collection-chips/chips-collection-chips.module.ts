import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChipsCollectionChipsComponent } from './list/chips-collection-chips.component';
import { ChipsCollectionChipsDetailComponent } from './detail/chips-collection-chips-detail.component';
import { ChipsCollectionChipsUpdateComponent } from './update/chips-collection-chips-update.component';
import { ChipsCollectionChipsDeleteDialogComponent } from './delete/chips-collection-chips-delete-dialog.component';
import { ChipsCollectionChipsRoutingModule } from './route/chips-collection-chips-routing.module';

@NgModule({
  imports: [SharedModule, ChipsCollectionChipsRoutingModule],
  declarations: [
    ChipsCollectionChipsComponent,
    ChipsCollectionChipsDetailComponent,
    ChipsCollectionChipsUpdateComponent,
    ChipsCollectionChipsDeleteDialogComponent,
  ],
  entryComponents: [ChipsCollectionChipsDeleteDialogComponent],
})
export class ChipsCollectionChipsModule {}
