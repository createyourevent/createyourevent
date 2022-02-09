import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IReservation } from "app/entities/reservation/reservation.model";
import { ReservationService } from "app/entities/reservation/service/reservation.service";
import { JhiEventManager } from "ng-jhipster";


@Component({
  templateUrl: './guest-reservation-delete-dialog.component.html'
})
export class GuestReservationDeleteDialogComponent {
  reservation?: IReservation;

  constructor(
    protected reservationService: ReservationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reservationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('reservationListModification');
      this.activeModal.close();
    });
  }
}
