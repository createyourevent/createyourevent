import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IServiceMap } from '../service-map.model';
import { ServiceMapService } from '../service/service-map.service';

@Component({
  templateUrl: './service-map-delete-dialog.component.html',
})
export class ServiceMapDeleteDialogComponent {
  serviceMap?: IServiceMap;

  constructor(protected serviceMapService: ServiceMapService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceMapService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
