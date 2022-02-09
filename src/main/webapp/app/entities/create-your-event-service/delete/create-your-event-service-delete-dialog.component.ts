import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreateYourEventService } from '../create-your-event-service.model';
import { CreateYourEventServiceService } from '../service/create-your-event-service.service';

@Component({
  templateUrl: './create-your-event-service-delete-dialog.component.html',
})
export class CreateYourEventServiceDeleteDialogComponent {
  createYourEventService?: ICreateYourEventService;

  constructor(protected createYourEventServiceService: CreateYourEventServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.createYourEventServiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
