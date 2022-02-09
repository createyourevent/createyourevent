import { IEvent } from 'app/entities/event/event.model';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from 'primeng/api';
import { GeneralService } from '../../general.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from "dayjs";
import * as moment from "moment";
import { GoogleGeocodeService } from 'app/google-geocode.service';
import { TranslateService } from '@ngx-translate/core';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';
import { ServiceCategory } from 'app/entities/enumerations/service-category.model';
import { IEventServiceMapOrder, EventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ServiceMapService } from 'app/entities/service-map/service/service-map.service';
import { EventServiceMapOrderService } from "app/entities/event-service-map-order/service/event-service-map-order.service";
import { EventService } from 'app/entities/event/service/event.service';
import { EventProductOrderService } from 'app/entities/event-product-order/service/event-product-order.service';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';

interface Category {
  name: string;
  value: string;
}

@Component({
    selector: 'jhi-edit-services',
    templateUrl: './edit-services.component.html',
    styleUrls: ['edit-services.component.scss'],
    providers: [MessageService]
  })
  export class EditServicesComponent implements OnInit, OnDestroy {
    services!: ICreateYourEventService[];
    category!: ServiceCategory;
    serviceMaps: IServiceMap[] = [];
    isAdding = false;
    isSaving = false;
    distanceSlider = 0;
    posEvent!: google.maps.LatLng;
    categories: Category[] = [];
    cat!: Category;

    jhiEvent: IEvent;

    totalCosts = 0;
    revenue = 0;
    investment = 0;
    totalLocationCosts = 0;

    eventServiceMapOrders: IEventServiceMapOrder[];
    eventProductOrders: IEventProductOrder[];

    public totalProducts = 0;
    public totalServices = 0;
    public totalRideCosts = 0;
    public totalCart = 0;
    public totalShipping = 0;
    public totalDeliveryCosts = 0;
    public totalDeliveryRideCosts = 0;

    constructor(
      private generalService: GeneralService,
      private router: Router,
      private service: CreateYourEventServiceService,
      private eventProductOrderService: EventProductOrderService,
      private serviceMapService: ServiceMapService,
      private googleGeocoderService: GoogleGeocodeService,
      private messageService: MessageService,
      private translate: TranslateService,
      private eventServiceMapOrderService: EventServiceMapOrderService,
      private route: ActivatedRoute,
      protected jhiEventService: EventService,
    ) {}

    ngOnInit(): void {
      const eventId = this.route.snapshot.params['eventId'];
      this.jhiEventService.find(eventId).subscribe(ev => {
        this.jhiEvent = ev.body!;
        this.generalService.findOrganizationReservationsByEventId(this.jhiEvent.id).subscribe(res => {
          res.body.forEach(ele => {
            this.totalLocationCosts += ele.total;
          });
        });
        this.generalService.getAllEventServiceMapsOrdersByEventId(this.jhiEvent.id).subscribe(res => {
          this.eventServiceMapOrders = res.body;
          this.eventServiceMapOrders.forEach(order => {
            this.totalServices += order.total;
          });
        })
        this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id!).subscribe(epos => {
          this.eventProductOrders = epos.body!;

          const keys=Object.keys(ServiceCategory);
          keys.forEach(element => {
            const service = element;
            this.categories.push({ name: this.translate.instant('createyoureventApp.ServiceCategory.' + service), value: service });
          });

          this.calcRevenue();
          this.getInvestment();
          this.calcProducts();
          this.generalService.getServicesWhereActiveAndActiveOwnerTrue().subscribe(res => {
            this.services = res.body!;
            this.services.forEach(element => {
              this.generalService.findByCreateYourEventServiceId(element.id!).subscribe(smap => {
               element.serviceMaps = smap.body;
                element.serviceMaps!.forEach(e => {
                  this.generalService.getAllServiceOffersByServiceMapId(e.id!).subscribe(so => {
                    e.serviceOffers = so.body;
                  });
                });
                this.eventServiceMapOrders.forEach(ele => {
                  const found = element.serviceMaps!.findIndex(x => x.id === ele.id);
                  if (found !== -1 || !ele.serviceMap!.serviceOffers || ele.serviceMap!.serviceOffers.length === 0) {
                    element.serviceMaps!.splice(found, 1);
                  }
                });
              });
            });
          });
        });
      });
    }

    ngOnDestroy(): void {}


    selectCategory(ev: any): void {
      this.category = ev.value;
      this.generalService.getServicesWhereActiveAndActiveOwnerTrue().subscribe(res => {
        this.services = res.body!;
        this.serviceMaps = [];
        this.services.forEach(element => {

          this.generalService.findByCreateYourEventServiceId(element.id!).subscribe(smap => {
            element.serviceMaps = smap.body;
            if (this.category === element.category) {
              element.serviceMaps!.forEach(e => {
                if(e.serviceOffers!.length > 0) {
                  this.serviceMaps.push(e);
                }
              });
              // this.serviceMaps = this.serviceMaps.concat(element.serviceMaps);
              this.eventServiceMapOrders.forEach(ele => {
                const found = this.serviceMaps.findIndex(x => x.id === ele.id);
                if (found !== -1 || ele.serviceMap!.serviceOffers!.length === 0) {
                  this.serviceMaps.splice(found, 1);
                }
              });
              this.serviceMaps.forEach(sm => {
                this.generalService.getAllServiceOffersByServiceMapId(sm.id!).subscribe(res => {
                  sm.serviceOffers = res.body;
                });
              });
            }

          });
        });
      });
    }

    total(offers: any): number {
      let total = 0;
      if(!offers || offers === undefined) {
        return 0;
      }
      offers.forEach((element: any) => {
        total += element.costHour;
      });
      return total;
    }

    save(): void {
      this.isAdding = true;
      this.isAdding = false;
      this.router.navigate(['/organisator/create-event/overview']);
    }

    flipCard(id: number) {
      const card = document.querySelector('.flipcard-' + id);
      card.classList.toggle('is-flipped');
    }

    formatAddress(address: string): string {

      const googleAddressArray = address.split(',');
      let fa = `
      ${googleAddressArray[0]}
      ${googleAddressArray[1]}
      ${googleAddressArray[2]}`;
      return fa;
    }

    gotoService(id: number) {
      this.router.navigate(['/services/' + id + '/viewService']);
    }

    addToCart(serviceMap: IServiceMap): void {
      const order: IEventServiceMapOrder = new EventServiceMapOrder();
      order.serviceMap = serviceMap;
      const dateFromField = document.getElementById('field_dateStart-' + serviceMap.id) as HTMLInputElement;
      const dateUntilField = document.getElementById('field_dateEnd-' + serviceMap.id) as HTMLInputElement;
      const timeFromField = document.getElementById('field_timeStart-' + serviceMap.id) as HTMLInputElement;
      const timeUntilField = document.getElementById('field_timeEnd-' + serviceMap.id) as HTMLInputElement;
      const dateFrom = dayjs(dateFromField.value + ' ' + timeFromField.value);
      const dateUntil = dayjs(dateUntilField.value + ' ' + timeUntilField.value);

      if (
        dateFromField.value === '' ||
        dateUntilField.value === '' ||
        timeFromField.value === '' ||
        timeUntilField.value === '' ||
        !dateFrom.isValid() ||
        !dateUntil.isValid()
      ) {
        this.isAdding = false;
        this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('select-products.error'), detail: this.translate.instant('select-services.error_rent_dates') });
        return;
      }

      order.date = dayjs();
      order.dateFrom = dateFrom;
      order.dateUntil = dateUntil;
      order.event = this.jhiEvent;
      let totalCostHour = 0;
      this.generalService.getAllServiceOffersByServiceMapId(serviceMap.id!).subscribe(sos => {
        sos.body!.forEach(so => {
          totalCostHour += so.costHour!;
        });
        order.costHour = totalCostHour;
      });

      this.generalService.findAllEventServiceMapOrdersWithDateRangeAndEventId(dateFrom, dateUntil, this.jhiEvent.id).subscribe(smo => {
        const orders = smo.body;
        if (orders!.length > 0) {
          this.isAdding = false;
          this.messageService.add({
            key: 'myKey1',
            severity: 'error',
            summary: this.translate.instant('select-products.error'),
            detail: this.translate.instant('select-services.error_free_space'),
          });
          return;
        }

   // Calculate total with time
   const ms = dateUntil.diff(dateFrom);
   const duration = dayjs.duration(ms);
   const time = Math.floor(duration.asHours()) + moment.utc(ms).format(':mm');
   order.totalHours = time;
   let total = 0;
   serviceMap.serviceOffers!.forEach(element => {
     total += (element.costHour! / 60 / 60) * (ms / 1000);
   });
   order.total = total;

   // Calculate ride costs
   let serviceAddress;
   this.service.find(serviceMap.createYourEventService!.id!).subscribe(serv => {
     serviceAddress = serv.body!.address;

     const directionsService = new google.maps.DirectionsService();

     const request: google.maps.DirectionsRequest = {
       origin: serviceAddress,
       destination: this.jhiEvent.location.address.address,
       travelMode: google.maps.TravelMode.DRIVING
     };

     directionsService.route(request, (response: google.maps.DirectionsResult, status: google.maps.DirectionsStatus): void => {
       if (status === google.maps.DirectionsStatus.OK) {
         order.kilometre = response.routes[0].legs[0].distance.value / 1000;
         order.rideCosts = (response.routes[0].legs[0].distance.value / 1000) * serviceMap.rideCost!.pricePerKilometre!;

         if (this.getInvestment() + this.calcRevenue() < this.calcServices() + order.total + order.rideCosts) {
           this.isAdding = false;
           this.messageService.add({
             key: 'myKey1',
             severity: 'error',
             summary: this.translate.instant('select-products.error'),
             detail: this.translate.instant('select-products.not-enought-money')
           });
           return;
         }

         const found = this.serviceMaps.findIndex(x => x.id === serviceMap.id);
         this.serviceMaps.splice(found, 1);

         this.eventServiceMapOrders.push(order);
         this.calcRevenue();
         this.calcProducts();
         this.calcServices();
         this.calcRideCosts();
         this.calcTotalInCart();

         this.eventServiceMapOrderService.create(order).subscribe();
       }
     });
   });

      });
    }

    removeFromCart(serviceMapOrder: IEventServiceMapOrder): void {
      const found = this.eventServiceMapOrders.findIndex(x => x.id === serviceMapOrder.id);
      this.eventServiceMapOrders.splice(found, 1);
      this.serviceMapService.find(serviceMapOrder.serviceMap!.id!).subscribe(res => {
        const map = res.body;
        this.generalService.getAllServiceOffersByServiceMapId(map!.id!).subscribe(offers => {
          map!.serviceOffers = offers.body;
        });
        this.serviceMaps.push(map!);
        this.calcProducts();
        this.calcServices();
        this.calcRideCosts();
        this.calcTotalInCart();
        this.eventServiceMapOrderService.delete(serviceMapOrder.id).subscribe();
      });
    }

    calcServices(): number {
      let totalServices = 0;
      this.eventServiceMapOrders.forEach(element => {
        totalServices += element.total!;
      });
      this.totalServices = totalServices;
      return this.totalServices;
    }

    calcRideCosts(): number {
      let totalRideCosts = 0;
      this.eventServiceMapOrders.forEach(element => {
        totalRideCosts += element.rideCosts!;
      });
      this.totalRideCosts = totalRideCosts;
      return this.totalRideCosts;
    }

    calcTotalInCart(): number {
      this.totalCart =
        this.totalLocationCosts +
        this.calcProducts() +
        this.calcServices() +
        this.calcRideCosts() +
        this.totalDeliveryCosts +
        this.totalDeliveryRideCosts +
        this.totalShipping;
      return this.totalCart;
    }

    calcTotalCosts(): void {
      const sum = 0;
    }

    getInvestment(): number {
      this.investment = Number(this.jhiEvent.investment);
      return this.investment;
    }

    calcRevenue(): number {
      this.revenue = Number(this.jhiEvent.price) * Number(this.jhiEvent.minPlacenumber);
      return this.revenue;
    }

    previousState(): void {
      this.router.navigate(['/events/' + this.jhiEvent.id + '/edit']);
    }

    calcProducts(): number {
      let totalProducts = 0;
      this.eventProductOrders.forEach(element => {
        totalProducts += element.total!;
      });
      this.totalProducts = totalProducts;
      return this.totalProducts;
    }

    changeSliderRadius(e: any): void {
      const addressEvent = this.jhiEvent.location.address.address;
      let latEvent = 0;
      let lngEvent = 0;

      const queryParamEvent = addressEvent.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParamEvent).subscribe((resShop: any) => {
        const geocoderShop = resShop.body!['results'];
        const geometryShop = geocoderShop[0].geometry;
        latEvent = geometryShop.location.lat;
        lngEvent = geometryShop.location.lng;
        this.posEvent = new google.maps.LatLng(latEvent, lngEvent);
      });

      this.serviceMaps = [];
      this.services.forEach(element => {
        let latService = 0;
        let lngService = 0;
        let posService: google.maps.LatLng;
        const queryParamService = element.address!.replace(' ', '+');
        this.googleGeocoderService.getFromAddress(queryParamService).subscribe((resService: any) => {
          const geocoderService = resService.body!['results'];
          const geometryService = geocoderService[0].geometry;
          latService = geometryService.location.lat;
          lngService = geometryService.location.lng;
          posService = new google.maps.LatLng(latService, lngService);

          const distEventService = google.maps.geometry.spherical.computeDistanceBetween(this.posEvent, posService);

          if (this.category === element.category && (this.distanceSlider === 0 || distEventService < this.distanceSlider * 1000)) {
            this.serviceMaps = this.serviceMaps.concat(element.serviceMaps!);
            this.eventServiceMapOrders.forEach(ele => {
              const found = this.serviceMaps.findIndex(x => x.id === ele.id);
              if (found !== -1) {
                this.serviceMaps.splice(found, 1);
              }
            });
            this.serviceMaps.forEach(sm => {
              this.generalService.getAllServiceOffersByServiceMapId(sm.id!).subscribe(res => {
                sm.serviceOffers = res.body;
              });
            });
          }
        });
      });
    }
}
