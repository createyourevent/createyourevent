import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IServiceComment } from '../service-comment.model';
import { ServiceCommentService } from '../service/service-comment.service';

@Component({
  templateUrl: './service-comment-delete-dialog.component.html',
})
export class ServiceCommentDeleteDialogComponent {
  serviceComment?: IServiceComment;

  constructor(protected serviceCommentService: ServiceCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
