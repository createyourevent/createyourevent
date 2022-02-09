import { IReservation } from './../../../entities/reservation/reservation.model';
import { LocationService } from './../../../entities/location/service/location.service';
import { ShopService } from './../../../entities/shop/service/shop.service';
import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { SharedChatService } from "app/chat.service";
import { EventStatus } from "app/entities/enumerations/event-status.model";
import { EventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { EventServiceMapOrder } from "app/entities/event-service-map-order/event-service-map-order.model";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import * as dayjs from "dayjs";
import { OrganisatorService } from 'app/organisator/organisator.service';
import { TicketService } from 'app/entities/ticket/service/ticket.service';


@Component({
  selector: 'jhi-workflow-organisator',
  templateUrl: './workflow-organisator.component.html',
  styleUrls: ['workflow-organisator.component.scss']
})
export class WorkflowOrganisatorComponent implements OnChanges {
  @Input() jhiEvent!: IEvent;
  status = false;
  checked = false;
  definitelyAndConfirmed = false;

  minReservations = false;

  eventProductOrders!: EventProductOrder[];
  eventServiceMapOrders!: EventServiceMapOrder[];

  disabledOfProducts = false;
  disabledOfServicemaps = false;
  disabledOfOrganizationReservation = false;

  user!: IUser;

  reservations: number;


  constructor(private eventService: EventService,
              private generalService: GeneralService,
              private sharedChatService: SharedChatService,
              private shopService: ShopService,
              private locationService: LocationService,
              private organisatorService: OrganisatorService,) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jhiEvent'] !== undefined && changes['jhiEvent'].currentValue !== undefined) {
      this.jhiEvent = changes['jhiEvent'].currentValue;

      this.jhiEvent.organizationReservations.forEach(ele => {
        if(ele.seen && ele.approved) {
          this.disabledOfOrganizationReservation = true;
        }
      });

      this.generalService.findTicketsByEventId(this.jhiEvent.id).subscribe(t => {
        const tickets = t.body;
        let total = 0;
        tickets.forEach(ticket => {
          total += ticket.amount;
        });
        this.reservations = total;
        if(this.reservations >= this.jhiEvent.minPlacenumber) {
          this.minReservations = true;
        }
      });

      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body!;
      });

      this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id!).subscribe(res => {
        this.eventProductOrders = res.body!;

        this.eventProductOrders.forEach(ele => {
          this.shopService.find(ele.shop.id).subscribe(s => {
            ele.product.shop = s.body;
          });
        });

        this.eventProductOrders.forEach(element => {
          if(element.approved === null || element.approved === false ) {
            this.disabledOfProducts = true;
          }
        });
      });


      this.generalService.getAllEventServiceMapsOrdersByEventId(this.jhiEvent.id!).subscribe(res => {
        this.eventServiceMapOrders = res.body!;

        this.eventServiceMapOrders.forEach(element => {
          if(element.approved === null || element.approved === false ) {
            this.disabledOfServicemaps  = true;
          }
        });

      });

      if (this.jhiEvent.status === EventStatus.DEFINITELY) {
        this.status = true;
        this.checked = true;
      } else {
        this.status = false;
      }
      if (this.jhiEvent.status === EventStatus.DEFINITELY && this.jhiEvent.definitelyConfirmed === true) {
        this.definitelyAndConfirmed = true;
      }
    }
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  setStatusDefinitly(): void {
    this.locationService.find(this.jhiEvent.location.id).subscribe(ad => {
      this.jhiEvent.location = ad.body;
      if (this.jhiEvent?.status === EventStatus.PROCESSING) {
        this.jhiEvent.status = EventStatus.DEFINITELY;
        this.jhiEvent.definitelyConfirmed = true;
        this.eventService.update(this.jhiEvent).subscribe();
        this.status = true;
        this.checked = true;
      }
    });
  }

  is7DaysBeforEvent(): boolean {
    if ((dayjs().add(7, 'days').isAfter(dayjs(this.jhiEvent.dateStart)))) {
      return true;
    }
    return false;
  }

  setDefinitly(): void {
    this.locationService.find(this.jhiEvent.location.id).subscribe(ad => {
      this.jhiEvent.location = ad.body;
      this.jhiEvent.definitelyConfirmed = true;
      this.jhiEvent.status = EventStatus.DEFINITELY;
      this.eventService.update(this.jhiEvent).subscribe();
      this.status = true;
      this.checked = true;
    });
  }
}
