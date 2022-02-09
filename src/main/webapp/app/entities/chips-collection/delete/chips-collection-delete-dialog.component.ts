import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChipsCollection } from '../chips-collection.model';
import { ChipsCollectionService } from '../service/chips-collection.service';

@Component({
  templateUrl: './chips-collection-delete-dialog.component.html',
})
export class ChipsCollectionDeleteDialogComponent {
  chipsCollection?: IChipsCollection;

  constructor(protected chipsCollectionService: ChipsCollectionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chipsCollectionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
