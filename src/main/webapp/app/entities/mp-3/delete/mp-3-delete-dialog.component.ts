import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMp3 } from '../mp-3.model';
import { Mp3Service } from '../service/mp-3.service';

@Component({
  templateUrl: './mp-3-delete-dialog.component.html',
})
export class Mp3DeleteDialogComponent {
  mp3?: IMp3;

  constructor(protected mp3Service: Mp3Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mp3Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
