import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserExtension } from '../user-extension.model';
import { UserExtensionService } from '../service/user-extension.service';

@Component({
  templateUrl: './user-extension-delete-dialog.component.html',
})
export class UserExtensionDeleteDialogComponent {
  userExtension?: IUserExtension;

  constructor(protected userExtensionService: UserExtensionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userExtensionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
