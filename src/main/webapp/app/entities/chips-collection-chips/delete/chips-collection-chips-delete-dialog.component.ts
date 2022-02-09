import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChipsCollectionChips } from '../chips-collection-chips.model';
import { ChipsCollectionChipsService } from '../service/chips-collection-chips.service';

@Component({
  templateUrl: './chips-collection-chips-delete-dialog.component.html',
})
export class ChipsCollectionChipsDeleteDialogComponent {
  chipsCollectionChips?: IChipsCollectionChips;

  constructor(protected chipsCollectionChipsService: ChipsCollectionChipsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chipsCollectionChipsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
