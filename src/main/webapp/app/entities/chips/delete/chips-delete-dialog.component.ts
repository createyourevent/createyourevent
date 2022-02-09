import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChips } from '../chips.model';
import { ChipsService } from '../service/chips.service';

@Component({
  templateUrl: './chips-delete-dialog.component.html',
})
export class ChipsDeleteDialogComponent {
  chips?: IChips;

  constructor(protected chipsService: ChipsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chipsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
