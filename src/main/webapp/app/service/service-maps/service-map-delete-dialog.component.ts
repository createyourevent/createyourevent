import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IServiceMap } from "app/entities/service-map/service-map.model";
import { ServiceMapService } from "app/entities/service-map/service/service-map.service";
import { JhiEventManager } from "ng-jhipster";


@Component({
  templateUrl: './service-map-delete-dialog.component.html'
})
export class ServiceMapDeleteDialogComponent {
  serviceMap!: IServiceMap;

  constructor(
    protected serviceMapService: ServiceMapService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceMapService.delete(id).subscribe(() => {
      this.eventManager.broadcast('serviceMapListModification');
      this.activeModal.close();
    });
  }
}
