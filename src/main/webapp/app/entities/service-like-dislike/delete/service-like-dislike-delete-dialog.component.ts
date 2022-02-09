import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IServiceLikeDislike } from '../service-like-dislike.model';
import { ServiceLikeDislikeService } from '../service/service-like-dislike.service';

@Component({
  templateUrl: './service-like-dislike-delete-dialog.component.html',
})
export class ServiceLikeDislikeDeleteDialogComponent {
  serviceLikeDislike?: IServiceLikeDislike;

  constructor(protected serviceLikeDislikeService: ServiceLikeDislikeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceLikeDislikeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
