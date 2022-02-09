import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IEventServiceMapOrder } from "app/entities/event-service-map-order/event-service-map-order.model";
import { IEvent } from "app/entities/event/event.model";
import { IReservation } from "app/entities/reservation/reservation.model";
import { IWorksheet } from "app/entities/worksheet/worksheet.model";
import { GeneralService } from "app/general.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import { EventService as EventUserService } from "../event.service";


@Component({
  selector: 'jhi-calculation-event',
  templateUrl: './calculation-event.component.html',
  styleUrls: ['calculation-event.component.scss']
})
export class CalculationEventComponent implements OnChanges {
  @Input() jhiEvent?: IEvent;
  reservations!: IReservation[];
  worksheets!: IWorksheet[];
  productorders: IEventProductOrder[] = [];
  servicesorders: IEventServiceMapOrder[] = [];
  soldTickets: number = 0;

  constructor(
    private organisatorService: OrganisatorService,
    private generalService: GeneralService,
    private eventUserService: EventUserService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jhiEvent']) {
      this.organisatorService.findReservationsByEventId(this.jhiEvent?.id!).subscribe(reservationsRes => {
        this.reservations = reservationsRes.body!;
      });
      this.generalService.findTicketsByEventId(this.jhiEvent.id).subscribe(t => {
        const tickets = t.body;
        tickets.forEach(ticket => {
          this.soldTickets += ticket.amount;
        });
      });
      this.generalService.findWorksheetsByEventId(this.jhiEvent?.id!).subscribe(worksheetsRes => {
        this.worksheets = worksheetsRes.body!;
      });
      this.eventUserService.getProductsWithEventId(this.jhiEvent?.id!).subscribe(eventProductOrderRes => {
        this.productorders = eventProductOrderRes.body!;
      });
      this.generalService.getAllEventServiceMapsOrdersByEventId(this.jhiEvent!.id!).subscribe(res => {
        this.servicesorders = res.body!;
      });
    }
  }

  getNumberReservations(): number {
    return this.soldTickets;
  }

  calculateTotalProducts(): number {
    let total = 0;
    if(this.productorders.length === 0) {
      return 0;
    }
    this.productorders.forEach(productorder => {
      total += productorder.total!;
    });
    return total;
  }

  calculateTotalServices(): number {
    let total = 0;
    if(this.servicesorders.length === 0) {
      return 0;
    }
    this.servicesorders.forEach(serviceorder => {
      total += serviceorder.total!;
    });
    return total;
  }

  calculateTotalReservations(): number {
    return this.jhiEvent?.price! * this.reservations.length;
  }

  calculateTotalWorksheets(): number {
    let total = 0;
    this.worksheets.forEach(worksheet => {
      total += worksheet.total!;
    });
    return total;
  }
}
