import { GeneralService } from './../../general.service';
import { Component, OnInit } from "@angular/core";
import { ICreateYourEventService } from "app/entities/create-your-event-service/create-your-event-service.model";
import { CreateYourEventServiceService } from "app/entities/create-your-event-service/service/create-your-event-service.service";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { ShopService } from "app/entities/shop/service/shop.service";
import { IShop } from "app/entities/shop/shop.model";
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationReservationService } from 'app/entities/organization-reservation/service/organization-reservation.service';


@Component({
  selector: 'jhi-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['activate.component.scss']
})
export class ActivateComponent implements OnInit {
  events!: IEvent[];
  shops!: IShop[];
  services!: ICreateYourEventService[];
  organizations: IOrganization[];

  selectedValuesEvents: string[] = [];
  selectedValuesShops: string[] = [];
  selectedValuesServices: string[] = [];
  selectedValuesOrganizations: string[] = [];

  constructor(
    private eventService: EventService,
    private generalService: GeneralService,
    private shopService: ShopService,
    private createYourEventService: CreateYourEventServiceService,
    private organizationService: OrganizationService,
    private organizationReservationService: OrganizationReservationService
  ) {}

  ngOnInit(): void {
    this.eventService.query().subscribe(e => {
      this.events = e.body!;
      this.events.forEach(element => {
        if (element.active === true) {
          this.selectedValuesEvents.push('val-' + element.id);
        }
      });
    });

    this.shopService.query().subscribe(s => {
      this.shops = s.body!;
      this.shops.forEach(element => {
        if (element.active === true) {
          this.selectedValuesShops.push('val-' + element.id);
        }
      });
    });

    this.organizationService.query().subscribe(o => {
      this.organizations = o.body!;
      this.organizations.forEach(element => {
        if (element.active === true) {
          this.selectedValuesOrganizations.push('val-' + element.id);
        }
      });
    });

    this.createYourEventService.query().subscribe(s => {
      this.services = s.body!;
      this.services.forEach(element => {
        if (element.active === true) {
          this.selectedValuesServices.push('val-' + element.id);
        }
      });
    });
  }

  deleteEvent(e: any, id: number) {
    this.generalService.findOrganizationReservationsByEventId(id).subscribe(or => {
      const reservations = or.body;
      let i = 0;
      reservations.forEach(reservation => {
        i++;
        this.organizationReservationService.delete(reservation.id).subscribe(() => {
          if(i === reservations.length) {
            this.eventService.delete(id).subscribe();
            this.ngOnInit();
          }
        });
      });
    });
  }

  changeEvent(event: any, id: number): void {
    this.generalService.findEventWithId(id).subscribe(e => {
      const jhiEvent = e.body!;
      jhiEvent.active = event.checked;
      this.generalService.updateEvent(jhiEvent).subscribe();
    });
  }

  changeShop(event: any, id: number): void {
    this.shopService.find(id).subscribe(s => {
      const shop = s.body!;
      shop.active = event.checked;
      shop.activeOwner = event.checked;
      this.shopService.update(shop).subscribe();
    });
  }

  changeOrganization(event: any, id: number): void {
    this.shopService.find(id).subscribe(s => {
      const organization = s.body!;
      organization.active = event.checked;
      organization.activeOwner = event.checked;
      this.organizationService.update(organization).subscribe();
    });
  }

  changeService(event: any, id: number): void {
    this.createYourEventService.find(id).subscribe(e => {
      const service = e.body!;
      service.active = event.checked;
      service.activeOwner = event.checked;
      this.createYourEventService.update(service).subscribe();
    });
  }
}
