import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizationLikeDislike } from '../organization-like-dislike.model';
import { OrganizationLikeDislikeService } from '../service/organization-like-dislike.service';

@Component({
  templateUrl: './organization-like-dislike-delete-dialog.component.html',
})
export class OrganizationLikeDislikeDeleteDialogComponent {
  organizationLikeDislike?: IOrganizationLikeDislike;

  constructor(protected organizationLikeDislikeService: OrganizationLikeDislikeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizationLikeDislikeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
