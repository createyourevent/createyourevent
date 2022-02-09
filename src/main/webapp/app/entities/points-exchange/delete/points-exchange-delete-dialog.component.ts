import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPointsExchange } from '../points-exchange.model';
import { PointsExchangeService } from '../service/points-exchange.service';

@Component({
  templateUrl: './points-exchange-delete-dialog.component.html',
})
export class PointsExchangeDeleteDialogComponent {
  pointsExchange?: IPointsExchange;

  constructor(protected pointsExchangeService: PointsExchangeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pointsExchangeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
