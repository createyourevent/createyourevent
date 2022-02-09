import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Address } from "app/entities/address/address.model";
import { AddressService } from "app/entities/address/service/address.service";
import { EventStatus } from "app/entities/enumerations/event-status.model";
import { ProductType } from "app/entities/enumerations/product-type.model";
import { IEventDetails, EventDetails } from "app/entities/event-details/event-details.model";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { EventProductOrderService } from "app/entities/event-product-order/service/event-product-order.service";
import { EventServiceMapOrderService } from "app/entities/event-service-map-order/service/event-service-map-order.service";
import { IEvent } from "app/entities/event/event.model";
import { LocationService } from "app/entities/location/service/location.service";
import { ProductService } from "app/entities/product/service/product.service";
import { ServiceMapService } from "app/entities/service-map/service/service-map.service";
import { TagsService } from "app/entities/tags/service/tags.service";
import { Tags } from "app/entities/tags/tags.model";
import { UserPointAssociationService } from "app/entities/user-point-association/service/user-point-association.service";
import { UserPointAssociation } from "app/entities/user-point-association/user-point-association.model";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import { PointsDataService } from "app/points/points-display/points-display.service";
import { Subscription } from "rxjs";
import { SharedEventService } from "./shared-event.service";
import { Event } from "app/entities/event/event.model";
import * as dayjs from "dayjs";
import {Location} from "app/entities/location/location.model";
import { EventService as EventUserService } from "app/views/event/event.service";
import { EventService } from "app/entities/event/service/event.service";
import { OrganizationReservationService } from "app/entities/organization-reservation/service/organization-reservation.service";
import { IOrganization } from "app/entities/organization/organization.model";
import { EventDetailsService } from "app/entities/event-details/service/event-details.service";

@Component({
  selector: 'jhi-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  eventId!: number;
  event!: IEvent;
  model: any;

  flyer = '';
  flyerContentType = '';
  youtube = '';

  selectedEventProductOrders!: IEventProductOrder[];

  realEstateProducts: IEventProductOrder[] = [];
  foodProducts: IEventProductOrder[] = [];
  drinkProducts: IEventProductOrder[] = [];
  musicProducts: IEventProductOrder[] = [];
  lightshowProducts: IEventProductOrder[] = [];
  decorationProducts: IEventProductOrder[] = [];
  miscellaneousProducts: IEventProductOrder[] = [];

  isSaving = false;
  isSaved = false;
  savedProducts = false;
  savedServicemaps = false;
  savedPoints = false;


  geocoder!: google.maps.GeocoderResult;

  points!: number;
  subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public sharedEventService: SharedEventService,
    private router: Router,
    private googleGeocoderService: GoogleGeocodeService,
    private locationService: LocationService,
    private addressService: AddressService,
    private eventProductOrderService: EventProductOrderService,
    private eventUserService: EventUserService,
    private productService: ProductService,
    private serviceMapService: ServiceMapService,
    private eventServiceMapOrderService: EventServiceMapOrderService,
    private tagsService: TagsService,
    private generalService: GeneralService,
    private userService: UserService,
    private pointsDataService: PointsDataService,
    private userPointAssociationService: UserPointAssociationService,
    private organizationReservationService: OrganizationReservationService,
    private eventDetailsService: EventDetailsService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.pointsDataService.currentPoint.subscribe(points => (this.points = points));

    this.model = this.sharedEventService.sharedEvent;
    this.selectedEventProductOrders = this.sharedEventService.selectedEventProductOrders;

    this.flyer = this.sharedEventService.sharedFlyer;
    this.flyerContentType = this.sharedEventService.sharedFlyerContentType;
    this.youtube = this.sharedEventService.sharedYoutube;

    this.sharedEventService.selectedEventProductOrders.forEach(eventProductOrder => {
      switch (eventProductOrder.product!.productType) {
        case ProductType.REAL_ESTATE:
          this.realEstateProducts.push(eventProductOrder);
          break;
        case ProductType.FOOD:
          this.foodProducts.push(eventProductOrder);
          break;
        case ProductType.DRINK:
          this.drinkProducts.push(eventProductOrder);
          break;
        case ProductType.MUSIC:
          this.musicProducts.push(eventProductOrder);
          break;
        case ProductType.LIGHTSHOW:
          this.lightshowProducts.push(eventProductOrder);
          break;
        case ProductType.DECORATION:
          this.decorationProducts.push(eventProductOrder);
          break;
        case ProductType.MISCELLANEOUS:
          this.miscellaneousProducts.push(eventProductOrder);
          break;
      }
    });
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {}

  submit(): void {
    this.isSaving = true;
    let user: IUser;
    this.generalService.findWidthAuthorities().subscribe(u => {
      user = u.body!;

      const eventDetails: IEventDetails = new EventDetails();
      eventDetails.totalEntranceFee = Number(this.model.price) * Number(this.model.placenumber);
      const event = new Event();
      event.user = user;
      //this.eventDetailsService.create(eventDetails).subscribe(edf => {
       // const edfb = edf.body;
        event.eventDetail = eventDetails;
        event.name = this.model.name;
        event.motto = this.model.motto;
        event.category = this.model.select_event_category;

        const date = dayjs(this.model.date_start + ' ' + this.model.time_start);
        event.dateStart = date;
        const dateEnd = dayjs(this.model.date_end + ' ' + this.model.time_end);
        event.dateEnd = dateEnd;

        event.description = this.model.description;
        event.privateOrPublic = this.model.private_public;
        event.price = this.model.price;
        event.minPlacenumber = this.model.minPlacenumber;
        event.placenumber = this.model.placenumber;
        event.investment = this.model.investment;
        event.status = EventStatus.PROCESSING;
        event.definitelyConfirmed = false;

        const address = new Address();
        if(!this.sharedEventService.organization) {
          address.address = this.model.address;
        }else {
          address.address = this.sharedEventService.organization.address;
        }
        const queryParam = address.address!.replace(' ', '+');
        this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
          const geocoder = res.body!['results'];
          const geometry = geocoder[0].geometry;
          address.lat = geometry.location.lat;
          address.lng = geometry.location.lng;
          //this.addressService.create(address).subscribe(ad => {
          //  const adr = ad.body;
            const location = new Location();
            if(!this.sharedEventService.organization) {
              location.description = this.model.description_location;
              location.name = this.model.name_location;
            }else {
              location.description = this.sharedEventService.organization.description;
              location.name = this.sharedEventService.organization.name;
            }
            location.address = address;
            //this.locationService.create(location).subscribe(lo => {
            //  const lob = lo.body;
              event.location = location;
              event.flyer = this.sharedEventService.sharedFlyer;
              event.flyerContentType = this.sharedEventService.sharedFlyerContentType;
              event.youtube = this.sharedEventService.sharedYoutube;
              event.status = EventStatus.PROCESSING;

              const organizationReservation = this.sharedEventService.organizationReservation;

              this.eventService.create(event).subscribe(eventWithId => {

                organizationReservation.event = eventWithId.body;
                organizationReservation.user = user;
                this.organizationReservationService.create(organizationReservation).subscribe(() => {
                  let i = 0;
                if(this.sharedEventService.selectedEventProductOrders.length === 0) {
                  this.savedProducts = true;
                } else {
                  this.sharedEventService.selectedEventProductOrders.forEach(eop => {
                    eop.event = eventWithId.body;
                    eop.date = dayjs();
                    this.productService.update(eop.product!).subscribe(editProd => {
                      eop.product = editProd.body!;
                      this.eventProductOrderService.create(eop).subscribe(() => {
                        eventWithId.body.eventProductOrders?.push(eop);
                        if(i === this.sharedEventService.selectedEventProductOrders.length - 1) {
                          this.savedProducts = true;
                        }
                        i++;
                      });
                    });
                  });
                }

                let y = 0;
                if(this.sharedEventService.selectedEventServiceMapOrders.length === 0){
                  this.savedServicemaps = true;
                } else {
                this.sharedEventService.selectedEventServiceMapOrders.forEach(esmp => {
                  esmp.event = eventWithId.body;
                  esmp.date = dayjs();
                  this.serviceMapService.update(esmp.serviceMap!).subscribe(editServiceMap => {
                    esmp.serviceMap = editServiceMap.body;
                    this.eventServiceMapOrderService.create(esmp).subscribe(esmpn => {
                      eventWithId.body.eventServiceMapOrders!.push(esmpn.body!);
                      if(y === this.sharedEventService.selectedEventServiceMapOrders.length - 1) {
                        this.savedServicemaps = true;
                      }
                      y++;
                    });
                  });
                });
              }

              this.eventService.update(eventWithId.body).subscribe(() => {
                const keywords: any[] = this.model.keywords;
                keywords.forEach(keyword => {
                  const tag = new Tags();
                  tag.event = eventWithId.body;
                  tag.tag = keyword.value;
                  this.tagsService.create(tag).subscribe();
                });

                if(event.price === 0 && event.investment === 0) {
                  this.isSaving = false;
                  this.isSaved = true;


                  this.generalService.findPointsByKey('create_event').subscribe(p => {
                    const points = p.body!;
                    this.generalService.findUserPointAssociationByUsersIdAndPointkey(user.id, points.key!).subscribe(s => {
                      const upa = s.body!;
                      const day = dayjs().date();
                      let it = 0;
                      upa.forEach(element => {
                        if (element.date!.date() === day) {
                          it++;
                        }
                      });
                      if (it < points.countPerDay!) {
                        const iupa = new UserPointAssociation();
                        iupa.users = user;
                        iupa.points = points;
                        iupa.date = dayjs();
                        this.userPointAssociationService.create(iupa).subscribe();
                        user.points! += points.points!;
                        user.loggedIn = true;
                        this.generalService.updateUserLoggedInAndPoints(user.id, user.loggedIn, user.points!).subscribe(t => {
                          this.generalService.findWidthAuthorities().subscribe(k => {
                            this.pointsDataService.changePoint(k.body!.points!);
                            this.savedPoints = true;
                          });
                        });
                      }
                    });
                  });
                  return;
                }

                this.generalService.findPointsByKey('create_event').subscribe(p => {
                  const points = p.body!;
                  this.generalService.findUserPointAssociationByUsersIdAndPointkey(user.id, points.key!).subscribe(s => {
                    const upa = s.body!;
                    const day = dayjs().date();
                    let it = 0;
                    upa.forEach(element => {
                      if (element.date!.date() === day) {
                        it++;
                      }
                    });
                    if (it < points.countPerDay!) {
                      const iupa = new UserPointAssociation();
                      iupa.users = user;
                      iupa.points = points;
                      iupa.date = dayjs();
                      this.userPointAssociationService.create(iupa).subscribe();
                      user.points! += points.points!;
                      user.loggedIn = true;
                      this.generalService.updateUserLoggedInAndPoints(user.id, user.loggedIn, user.points!).subscribe(t => {
                        this.generalService.findWidthAuthorities().subscribe(k => {
                          this.pointsDataService.changePoint(k.body!.points!);
                          this.savedPoints = true;
                        });
                      });
                    }
                  });
                });
                window.scrollTo(0,0);
                this.isSaving = false;
                this.isSaved = true;
              });
                });
              });
            //});
          //});
        });
      //})

    });
  }

  previousState(): void {
    window.history.back();
  }

  formatAddress(org: IOrganization): string {
    const googleAddressArray = org.address!.split(',');
    const address = googleAddressArray![0];
    const place = googleAddressArray![1];
    const land = googleAddressArray![2];
    const fa = (address + '\n' + place + '\n' + land).trim();
    return fa;
  }
}
