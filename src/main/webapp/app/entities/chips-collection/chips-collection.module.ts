import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChipsCollectionComponent } from './list/chips-collection.component';
import { ChipsCollectionDetailComponent } from './detail/chips-collection-detail.component';
import { ChipsCollectionUpdateComponent } from './update/chips-collection-update.component';
import { ChipsCollectionDeleteDialogComponent } from './delete/chips-collection-delete-dialog.component';
import { ChipsCollectionRoutingModule } from './route/chips-collection-routing.module';

@NgModule({
  imports: [SharedModule, ChipsCollectionRoutingModule],
  declarations: [
    ChipsCollectionComponent,
    ChipsCollectionDetailComponent,
    ChipsCollectionUpdateComponent,
    ChipsCollectionDeleteDialogComponent,
  ],
  entryComponents: [ChipsCollectionDeleteDialogComponent],
})
export class ChipsCollectionModule {}
