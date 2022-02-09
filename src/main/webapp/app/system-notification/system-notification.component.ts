import { IServiceMap } from './../entities/service-map/service-map.model';
import { IShop } from './../entities/shop/shop.model';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { EventStatus } from "app/entities/enumerations/event-status.model";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IEvent } from "app/entities/event/event.model";
import { IReservation } from "app/entities/reservation/reservation.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import * as dayjs from "dayjs";
import { Subject, Subscription } from "rxjs";
import { SharedNotificationService } from "./SharedNotificationService.service";
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IOrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';


@Component({
  selector: 'jhi-system-notification',
  templateUrl: './system-notification.component.html',
  styleUrls: ['./system-notification.component.scss']
})
export class SystemNotificationComponent implements OnInit, OnDestroy {
  user!: IUser;
  isShowMessages = true;
  events!: IEvent[];
  eventsIn7days: IEvent[] = [];
  messages!: {};
  totalMessages = 0;
  eventsWithDistanceAndSevenDays: IEvent[] = [];
  refresh: Subject<any> = new Subject();
  tickets: IReservation[] = [];
  subscription!: Subscription;

  subscriptionPR: Subscription;

  changeEventsubscription!: Subscription;

  eventProductOrders: IEventProductOrder[] = [];
  shopsNotSeen: IShop[] = [];

  servicesNotSeen: ICreateYourEventService[] = [];
  serviceMapsNotSeen: IServiceMap[] = [];

  organizationsNotSeen: IOrganizationReservation[] = [];


  constructor(
    private generalService: GeneralService,
    private googleGeocoderService: GoogleGeocodeService,
    private sharedNotificationService: SharedNotificationService,
    private router: Router
  ) {
    this.subscriptionPR = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
       if(!router.navigated) {
        this.totalMessages = 0;
        this.loadAlertMessages();
        this.loadAllEventsInDistance(25);
        this.loadTickets();
        this.loadEventProductOrders();
        this.loadServiceOrders();
       }
      }
  });
  }

  ngOnDestroy(): void {
    this.changeEventsubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.subscriptionPR.unsubscribe();
  }

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;

      if(this.user !== null) {
        this.totalMessages = 0;
        this.loadAlertMessages();
        this.loadAllEventsInDistance(25);
        this.loadTickets();
        this.loadEventProductOrders();
        this.loadServiceOrders();
        this.loadOrganizationReservations();

        this.changeEventsubscription = this.sharedNotificationService.getLoginEvent().subscribe(() => {
          this.totalMessages = 0;
          this.loadAlertMessages();
          this.loadAllEventsInDistance(25);
          this.loadTickets();
          this.loadEventProductOrders();
          this.loadServiceOrders();
          this.loadOrganizationReservations();
        });
      }
    });
  }

  loadTickets(): void {
    this.tickets = [];
    this.generalService.getReservationsByUserAndNotBilled(this.user.id!).subscribe(r => {
      r.body!.forEach(element => {
        if (element!.event!.definitelyConfirmed && element!.event!.status === EventStatus.DEFINITELY) {
          this.tickets.push(element);
          this.totalMessages++;
          this.refresh.next();
        }
      });
    });
  }

  loadAlertMessages(): void {
    this.eventsIn7days = [];
    this.generalService.findAllEventsByActiveTrueAndDateEndAfterAndUserId(dayjs(), this.user.id).subscribe(e => {
      this.events = e.body!;
      this.events.forEach(element => {
        const warning = dayjs(element.dateStart)
          .subtract(21, 'days')
          .startOf('day');

        if (dayjs(element.dateStart).isAfter(warning) && !element.definitelyConfirmed) {
          this.eventsIn7days.push(element);
          this.totalMessages++;
          this.refresh.next();
        }
      });
    });
  }

  loadServiceOrders(): void {
    this.servicesNotSeen = [];
    this.serviceMapsNotSeen = [];
    let esmos: IEventServiceMapOrder[] = [];
    this.generalService.getServicesFromUserAndActive(this.user.id).subscribe(res => {
      const services = res.body;
      let i = 0;
      services.forEach(service => {
        i++;
        this.generalService.findByCreateYourEventServiceId(service.id).subscribe(res => {{
          const servicemaps = res.body;
          let l = 0;
          servicemaps.forEach(sm => {
            l++;
            this.generalService.getAllEventServiceMapsOrdersByServiceMapId(sm.id).subscribe(esmo => {
              esmos = esmos.concat(esmo.body);
              if(i === services.length && l === servicemaps.length) {
                esmos.forEach(elem => {
                  if(!elem.seen) {
                    elem.serviceMap.createYourEventService = service;
                    this.serviceMapsNotSeen.push(elem.serviceMap);
                    this.totalMessages++;
                    this.refresh.next();
                  }
                });
              }
            });
          })
          }
        });
      })
    });
  }

  loadEventProductOrders(): void {
    this.shopsNotSeen = [];
    this.generalService.findShopsByUserAndActiveTrue().subscribe(s => {
      const shops = s.body;
      let i = 0;
      shops.forEach(element => {
        i++;
        this.generalService.findAllEventProductOrdersByShopId(element.id).subscribe(epos => {
          const eventProductOrders = epos.body;
          eventProductOrders.forEach(res => {
            if(!res.seen) {
              this.eventProductOrders.push(res);
            }
          });
          if(i === shops.length) {
            this.eventProductOrders.forEach(el => {
              const sel = shops.find(x => el.shop.id === x.id);
              if(sel !== undefined) {
                const z = this.shopsNotSeen.findIndex(y => y.id === sel.id);
                if(z === -1) {
                  this.shopsNotSeen.push(sel);
                  this.totalMessages++;
                  this.refresh.next();
                }
              }
            });
          }
        });
      });
    });
  }

  loadAllEventsInDistance(dist: number): void {
    this.eventsWithDistanceAndSevenDays = [];
    this.generalService.findWidthAuthorities().subscribe(u => {
      const user = u.body;
      let latUser = 0;
      let lngUser = 0;
      let posUser: google.maps.LatLng;
      const queryParam = this.user.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
        const geocoder = res.body!['results'];
        const geometry = geocoder[0].geometry;
        latUser = geometry.location.lat;
        lngUser = geometry.location.lng;
        posUser = new google.maps.LatLng(latUser, lngUser);


        const now = dayjs();
        this.generalService.findEventByIsPublicAndActive().subscribe(res2 => {
          const events:IEvent[] = res2.body!;
          const eventsBeforSevenDays: IEvent[] = [];
          events.forEach(eve => {
            if(eve.definitelyConfirmed === true && eve.status === EventStatus.DEFINITELY) {
              //eventsBeforSevenDays.push(eve);
              const warning = dayjs(eve.dateStart)
              .subtract(21, 'days')
              .startOf('day');
              const t = warning.isBefore(dayjs());
              if(t) {
                eventsBeforSevenDays.push(eve);
              }
            }
          });
          eventsBeforSevenDays.forEach(element => {
            let latEvent = 0;
            let lngEvent = 0;
            let posEvent: google.maps.LatLng;
            const queryParamShop = element.location!.address!.address!.replace(' ', '+');
            this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
              const geocoderShop = resShop.body!['results'];
              const geometryShop = geocoderShop[0].geometry;
              latEvent = geometryShop.location.lat;
              lngEvent = geometryShop.location.lng;
              posEvent = new google.maps.LatLng(latEvent, lngEvent);

              const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posEvent);
              const maxDistance = dist * 1000;
              if (maxDistance > distance) {
                this.eventsWithDistanceAndSevenDays.push(element);
                this.totalMessages++;
                this.refresh.next();
              }
            });
          });
        });
      });
    });
  }

  loadOrganizationReservations() {
    this.generalService.findOrganizationReservationsByOrganizationWithUserId(this.user.id).subscribe(or => {
      const reservations = or.body;
      reservations.forEach(ele => {
        if(ele.seen === null || !ele.seen ) {
          this.organizationsNotSeen.push(ele);
        }
      });
    });
  }

  openNotifications(): void {
    this.isShowMessages = !this.isShowMessages;
  }
}
