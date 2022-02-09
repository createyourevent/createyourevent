import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChipsAdmin } from '../chips-admin.model';
import { ChipsAdminService } from '../service/chips-admin.service';

@Component({
  templateUrl: './chips-admin-delete-dialog.component.html',
})
export class ChipsAdminDeleteDialogComponent {
  chipsAdmin?: IChipsAdmin;

  constructor(protected chipsAdminService: ChipsAdminService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chipsAdminService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
