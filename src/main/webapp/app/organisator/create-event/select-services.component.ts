import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SharedEventService } from './shared-event.service';
import { GeneralService } from '../../general.service';
import { Router } from '@angular/router';
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

interface Category {
  name: string;
  value: string;
}

@Component({
  selector: 'jhi-select-services',
  templateUrl: './select-services.component.html',
  styleUrls: ['select-services.component.scss'],
  providers: [MessageService]
})
export class SelectServicesComponent implements OnInit, OnDestroy {
  model: any;
  services!: ICreateYourEventService[];
  category!: ServiceCategory;
  serviceMaps: IServiceMap[] = [];
  isAdding = false;
  isSaving = false;
  distanceSlider = 0;
  posEvent!: google.maps.LatLng;
  categories: Category[] = [];
  cat!: Category;

  totalCosts = 0;
  revenue = 0;
  investment = 0;
  totalLocationCosts = 0;

  constructor(
    public sharedEventService: SharedEventService,
    private generalService: GeneralService,
    private router: Router,
    private service: CreateYourEventServiceService,
    private serviceMapService: ServiceMapService,
    private googleGeocoderService: GoogleGeocodeService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.model = this.sharedEventService.sharedEvent;
    this.sharedEventService.select_services.forEach(element => {
      const service = element;
      this.categories.push({ name: this.translate.instant('createyoureventApp.ServiceCategory.' + service), value: service });
    });

    this.calcRevenue();
    this.getInvestment();
    this.getOrganizationCosts();
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
          this.sharedEventService.selectedEventServiceMapOrders.forEach(ele => {
            const found = element.serviceMaps!.findIndex(x => x.id === ele.id);
            if (found !== -1 || !ele.serviceMap!.serviceOffers || ele.serviceMap!.serviceOffers.length === 0) {
              element.serviceMaps!.splice(found, 1);
            }
          });
        });
      });
    });
  }

  ngOnDestroy(): void {}

  selectCategory(ev: any): void {
    this.category = ev.value;
    this.serviceMaps = [];
    this.services.forEach(element => {
      if (this.category === element.category) {
        element.serviceMaps!.forEach(e => {
          if(e.serviceOffers!.length > 0) {
            this.serviceMaps.push(e);
          }
        });
        // this.serviceMaps = this.serviceMaps.concat(element.serviceMaps);
        this.sharedEventService.selectedEventServiceMapOrders.forEach(ele => {
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
  }

  total(offers: any): number {
    let total = 0;
    offers.forEach((element: any) => {
      total += element.costHour;
    });
    return total;
  }

  getOrganizationCosts(): void {
    this.totalLocationCosts = Number(this.sharedEventService.organizationReservation.total);
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

    let totalCostHour = 0;
    this.generalService.getAllServiceOffersByServiceMapId(serviceMap.id!).subscribe(sos => {
      sos.body!.forEach(so => {
        totalCostHour += so.costHour!;
      });
      order.costHour = totalCostHour;
    });

    this.generalService.findAllEventServiceMapOrdersWithDateRangeAndServiceMapId(serviceMap.id, dateFrom, dateUntil).subscribe(smo => {
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
   let a = '';
   if(this.sharedEventService.organization !== null) {
    a = this.sharedEventService.organization.address;
   } else {
    a = this.model.address;
   }

   const request: google.maps.DirectionsRequest = {
     origin: serviceAddress,
     destination: a,
     travelMode: google.maps.TravelMode.DRIVING
   };

   directionsService.route(request, (response: google.maps.DirectionsResult, status: google.maps.DirectionsStatus): void => {
     if (status === google.maps.DirectionsStatus.OK) {
       order.kilometre = response.routes[0].legs[0].distance.value / 1000;
       order.rideCosts = (response.routes[0].legs[0].distance.value / 1000) * serviceMap.rideCost!.pricePerKilometre!;

       const a = this.sharedEventService.getInvestment() + this.sharedEventService.calcRevenue();
       const b = this.sharedEventService.getLocationCosts() + this.sharedEventService.calcServices() + order.total + order.rideCosts;
       if (a < b) {
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

       this.sharedEventService.selectedEventServiceMapOrders.push(order);
       this.calcRevenue();
       this.sharedEventService.calcServices();
       this.sharedEventService.calcRideCosts();
       this.sharedEventService.calcTotalInCart();
     }
   });
 });

    });
  }

  removeFromCart(serviceMapOrder: IEventServiceMapOrder): void {
    const found = this.sharedEventService.selectedEventServiceMapOrders.findIndex(x => x.id === serviceMapOrder.id);
    this.sharedEventService.selectedEventServiceMapOrders.splice(found, 1);
    this.serviceMapService.find(serviceMapOrder.serviceMap!.id!).subscribe(res => {
      const map = res.body;
      this.generalService.getAllServiceOffersByServiceMapId(map!.id!).subscribe(offers => {
        map!.serviceOffers = offers.body;
      });
      this.serviceMaps.push(map!);
      this.sharedEventService.calcServices();
      this.sharedEventService.calcRideCosts();
      this.sharedEventService.calcTotalInCart();
    });
  }

  calcTotalCosts(): void {
    const sum = 0;
  }

  getInvestment(): void {
    this.investment = Number(this.model.investment);
  }

  calcRevenue(): void {
    this.revenue = Number(this.model.price) * Number(this.model.minPlacenumber);
  }

  previousState(): void {
    this.router.navigate(['/organisator/create-event/select-products']);
  }

  changeSliderRadius(e: any): void {
    const addressEvent = this.model.address;
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
          this.sharedEventService.selectedEventServiceMapOrders.forEach(ele => {
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
