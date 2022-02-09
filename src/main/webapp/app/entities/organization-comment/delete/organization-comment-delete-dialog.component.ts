import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizationComment } from '../organization-comment.model';
import { OrganizationCommentService } from '../service/organization-comment.service';

@Component({
  templateUrl: './organization-comment-delete-dialog.component.html',
})
export class OrganizationCommentDeleteDialogComponent {
  organizationComment?: IOrganizationComment;

  constructor(protected organizationCommentService: OrganizationCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizationCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
