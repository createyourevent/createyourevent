import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IChips } from 'app/entities/chips/chips.model';
import { JhiEventManager } from 'ng-jhipster';

import { ChipsService } from './chips.service';

@Component({
  templateUrl: './chips-delete-dialog.component.html'
})
export class ChipsDeleteDialogComponent {
  chips?: IChips;

  constructor(protected chipsService: ChipsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chipsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('chipsListModification');
      this.activeModal.close();
    });
  }
}
