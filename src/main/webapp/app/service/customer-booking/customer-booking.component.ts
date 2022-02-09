import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SharedChatService } from "app/chat.service";
import { ICreateYourEventService } from "app/entities/create-your-event-service/create-your-event-service.model";
import { CreateYourEventServiceService } from "app/entities/create-your-event-service/service/create-your-event-service.service";
import { EventStatus } from "app/entities/enumerations/event-status.model";
import { IEventServiceMapOrder } from "app/entities/event-service-map-order/event-service-map-order.model";
import { EventServiceMapOrderService } from "app/entities/event-service-map-order/service/event-service-map-order.service";
import { EventService } from "app/entities/event/service/event.service";
import { IServiceMap } from "app/entities/service-map/service-map.model";
import { ServiceMapService } from "app/entities/service-map/service/service-map.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import * as dayjs from "dayjs";

@Component({
  selector: 'jhi-customer-booking',
  templateUrl: './customer-booking.component.html',
  styleUrls: ['customer-booking.component.scss']
})
export class CustomerBookingComponent implements OnInit {
  serviceMapOrders!: IEventServiceMapOrder[];
  user!: IUser;

  services!: ICreateYourEventService[];
  service!: ICreateYourEventService;
  serviceId!: number;

  serviceMaps!: IServiceMap[];
  serviceMap!: IServiceMap;
  serviceMapId: number;

  serviceMapsOrdersProvisionally: IEventServiceMapOrder[] = [];
  serviceMapsOrdersDefinitely: IEventServiceMapOrder[] = [];

  clickSeen = false;

  constructor(
    private generalService: GeneralService,
    private sharedChatService: SharedChatService,
    private route: ActivatedRoute,
    private createYourEventServiceService: CreateYourEventServiceService,
    private eventServiceMapOrderService: EventServiceMapOrderService,
    private eventService: EventService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    this.serviceMapId = Number(this.route.snapshot.paramMap.get('serviceMapId'));
    this.createYourEventServiceService.find(this.serviceId).subscribe(ser => {
      this.service = ser.body!;

      this.generalService.findByCreateYourEventServiceId(this.serviceId).subscribe(smaps => {
        this.serviceMaps = smaps.body!;
        if(this.serviceMapId) {
          const id = this.serviceMapId;
          this.serviceMapsOrdersProvisionally = [];
          this.serviceMapsOrdersDefinitely = [];
          this.generalService.getAllEventServiceMapsOrdersByServiceMapId(id).subscribe(smos => {
            smos.body!.forEach(smo => {
              this.eventService.find(smo.event.id).subscribe(e => {
                smo.event = e.body;
                if (dayjs(smo.event.dateStart).isAfter(dayjs()) && smo.event!.status === EventStatus.PROCESSING) {
                  this.generalService.findEventById(smo.event.id).subscribe(r => {
                    smo.event = r.body;
                    this.serviceMapsOrdersProvisionally.push(smo);
                  });
                } else if (
                  dayjs(smo.event.dateStart).isAfter(dayjs()) &&
                  smo.event.status === EventStatus.DEFINITELY &&
                  smo.event.definitelyConfirmed === true
                ) {
                  this.eventService.find(smo.event.id).subscribe(r => {
                    smo.event = r.body;
                    this.serviceMapsOrdersDefinitely.push(smo);
                  });
                }
              });
            });
          });
        }
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  selectServiceMap(event: any): void {
    const id = event.value;
    this.serviceMapsOrdersProvisionally = [];
    this.serviceMapsOrdersDefinitely = [];
    this.generalService.getAllEventServiceMapsOrdersByServiceMapId(id).subscribe(smos => {
      smos.body!.forEach(smo => {
        this.eventService.find(smo.event.id).subscribe(e => {
          smo.event = e.body;
          if (dayjs(smo.event.dateStart).isAfter(dayjs()) && smo.event!.status === EventStatus.PROCESSING) {
            this.generalService.findEventById(smo.event.id).subscribe(r => {
              smo.event = r.body;
              this.serviceMapsOrdersProvisionally.push(smo);
            });
          } else if (
            dayjs(smo.event.dateStart).isAfter(dayjs()) &&
            smo.event.status === EventStatus.DEFINITELY &&
            smo.event.definitelyConfirmed === true
          ) {
            this.eventService.find(smo.event.id).subscribe(r => {
              smo.event = r.body;
              this.serviceMapsOrdersDefinitely.push(smo);
            });
          }
        });
      });
    });
  }

  hasService(): boolean {
    return this.service === null;
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  seenChange(event: any, id: number): void {
    this.clickSeen = true;
    this.eventServiceMapOrderService.find(id).subscribe(smo => {
      const eventProductOrder = smo.body!;
      eventProductOrder.seen = true;

      this.eventServiceMapOrderService.update(eventProductOrder).subscribe(() => {
        this.clickSeen = false;
      });
    });
  }

  approvedChange(event: any, id: number): void {
    this.eventServiceMapOrderService.find(id).subscribe(smo => {
      const eventProductOrder = smo.body!;
      eventProductOrder.approved = true;

      this.eventServiceMapOrderService.update(eventProductOrder).subscribe();
    });
  }
}
