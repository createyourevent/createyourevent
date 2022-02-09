import { FeeTransactionEntryService } from './../../entities/fee-transaction-entry/service/fee-transaction-entry.service';
import { FeeTransactionService } from './../../entities/fee-transaction/service/fee-transaction.service';
import { FeeTransaction, IFeeTransaction } from './../../entities/fee-transaction/fee-transaction.model';
import { FeeTransactionEntry } from './../../entities/fee-transaction-entry/fee-transaction-entry.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../general.service';
import * as dayjs from 'dayjs';
import { IAdminFeesPrice } from 'app/entities/admin-fees-price/admin-fees-price.model';
import { AdminFeesPriceService } from 'app/entities/admin-fees-price/service/admin-fees-price.service';
import { ContactService } from 'app/entities/contact/service/contact.service';
import { CreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IShop } from 'app/entities/shop/shop.model';
import { IUser } from 'app/entities/user/user.model';
import { IEvent } from 'app/entities/event/event.model';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { FeeTransactionId } from 'app/entities/fee-transaction-id/fee-transaction-id.model';
import {forkJoin} from 'rxjs';
import { AfterViewChecked } from '@angular/core';
import { IOrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';
import { OrganizationReservationService } from 'app/entities/organization-reservation/service/organization-reservation.service';
import { FeeType } from 'app/entities/enumerations/fee-type.model';
import { OrganisatorService } from 'app/organisator/organisator.service';

declare const google: any;

@Component({
  selector: 'jhi-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit, AfterViewChecked {
  user!: IUser;

  shops: IShop[] = [];
  events: IEvent[] = [];
  services: CreateYourEventService[] = [];
  organizationReservations: IOrganizationReservation[] = [];

  shopsPaid: IShop[] = []
  eventsPaid: IEvent[] = [];
  servicesPaid: CreateYourEventService[] = [];
  organizationReservationsPaid: IOrganizationReservation[] = [];

  totalEvents = 0;
  totalShops = 0;
  totalServices = 0;
  totalOrganizations = 0;
  totalFeesEvents = 0;
  totalFeesShops = 0;
  totalFeesServices = 0;
  totalFeesOrganizations = 0;

  totalEventsPaid = 0;
  totalShopsPaid = 0;
  totalServicesPaid = 0;
  totalOrganizationsPaid = 0;
  totalFeesEventsPaid = 0;
  totalFeesShopsPaid = 0;
  totalFeesServicesPaid = 0;
  totalFeesOrganizationsPaid = 0;

  eventsApproved = false;
  shopsApproved = false;
  servicesApproved = false;
  organizationsApproved = false;

  showSuccess = false;

  fees!: IAdminFeesPrice;

  totalFees = 0;
  billed = false;

  loadedEvents = false;
  loadedShops = false;
  loadedServices = false;
  loadedOrganizations = false;

  loadedEventsPaid = false;
  loadedShopsPaid = false;
  loadedServicesPaid = false;
  loadedOrganizationsPaid = false;

  account_holder_name = '';

  loading = true;

  id: number;
  type: string;
  txId: string;
  refNo: string;

  private : Array<string>;

  constructor(
    protected dataUtils: JhiDataUtils,
    private fb: FormBuilder,
    protected eventManager: JhiEventManager,
    protected contactService: ContactService,
    protected activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private adminFeesEventService: AdminFeesPriceService,
    private route: ActivatedRoute,
    private feeTransactionService: FeeTransactionService,
    protected router: Router,
    private organizationReservationService: OrganizationReservationService,
    private organisatorService: OrganisatorService

  ) {}

  ngAfterViewChecked(): void {
    this.route.queryParams.subscribe(params => {
      this.txId = params['txId'];
      this.refNo = params['refNo'];
    });
  }

  loadEvents(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.generalService.findAllEventsByActiveTrueAndDateEndBeforAndUserId(dayjs(), this.user.id).subscribe(events => {
      const ev = events.body!;
      ev.forEach(event => {
            if(!event.billed) {
              this.events.push(event);
              this.totalEvents += event.price! * event.placenumber!;
              this.totalFeesEvents = (this.totalEvents / 100) * this.fees.feesOrganisator!;
            }else if(event.billed) {
              this.eventsPaid.push(event);
              this.totalEventsPaid += event.price * event.placenumber;
              this.totalFeesEventsPaid = (this.totalEventsPaid / 100) * this.fees.feesOrganisator!;
            }
      });
      resolve();
    });
  });
  return promise;
  }

  loadOrganizationReservations(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.generalService.byActiveTrueAndUserIdAndDateUntilSmallerThanNow(this.user.id).subscribe(organizationReservations => {
      const ors = organizationReservations.body!;
      if(ors === null || ors === undefined) {
        resolve();
        return;
      }
      ors.forEach(el => {
        if(el.feeBilled) {
          this.organizationReservationsPaid.push(el);
          this.totalOrganizationsPaid += el.total;
        } else {
          this.organizationReservations.push(el);
          this.totalOrganizations += el.total;
        }
      });
      this.totalFeesOrganizations = (this.totalOrganizations / 100) * this.fees.feesOrganizations!;
      this.totalFeesOrganizationsPaid = (this.totalOrganizationsPaid / 100) * this.fees.feesOrganizations!;
      resolve();
      return;
    });
  });
  return promise;
  }

  loadServices(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
    this.generalService.getServicesFromUserAndActive(this.user.id).subscribe(services => {
      if(services.body === null || services.body.length === 0) {
        resolve();
        return;
      }
      services.body.forEach(service => {
        this.generalService.findByCreateYourEventServiceId(service.id!).subscribe(serviceMaps => {
          if(serviceMaps.body === null || serviceMaps.body.length === 0) {
            resolve();
            return;
          }
          serviceMaps.body!.forEach(serviceMap => {
                  service.serviceMaps = serviceMaps.body;
                  if(serviceMap.eventServiceMapOrders ===   null || serviceMap.eventServiceMapOrders.length === 0) {
                    resolve();
                    return;
                  }
                  serviceMap.eventServiceMapOrders.forEach((eventServiceMapOrder: IEventServiceMapOrder) => {
                    if(!eventServiceMapOrder.billed && dayjs(eventServiceMapOrder.event.dateEnd).isBefore(dayjs(new Date()))) {
                      this.totalServices += eventServiceMapOrder.total!;
                      const z = this.services.findIndex(x => x.id === service.id);
                      if(z === -1) {
                        this.services.push(service);
                      }
                    }else if(eventServiceMapOrder.billed && dayjs(eventServiceMapOrder.event.dateEnd).isBefore(dayjs(new Date()))) {
                      this.totalServicesPaid += eventServiceMapOrder.total!;
                      const z = this.servicesPaid.findIndex(x => x.id === service.id);
                      if(z === -1) {
                        this.servicesPaid.push(service);
                      }
                    }
                  });
                  this.totalFeesServices = (this.totalServices / 100) * this.fees.feesService!;
                  this.totalFeesServicesPaid = (this.totalServicesPaid / 100) * this.fees.feesService!;
                  resolve();
                  return;
          });
        });
      });
    });
  });
  return promise;
  }

  loadShops(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
    this.generalService.findShopsByUserIdAndActiveTrue(this.user.id).subscribe(shops => {
      if(shops.body === null || shops.body.length === 0) {
        resolve();
      }
      let i = 0;
      shops.body!.forEach(shop => {
          i++;
          this.generalService
          .findAllEventProductOrderByShopIdAndDateStartSmallerThen(shop.id!, dayjs())
          .subscribe(eventProductOrders => {
            if(i === shops.body.length) {
              resolve();
            }
            if (eventProductOrders.body!.length > 0) {
              shop.eventProductOrders = eventProductOrders.body;
              eventProductOrders.body!.forEach(eventProductOrder => {
                if(!eventProductOrder.billed) {
                  this.totalShops += eventProductOrder.total!;
                  const z = this.shops.findIndex(x => x.id === shop.id);
                  if(z === -1) {
                    this.shops.push(shop);
                  }
                }else if(eventProductOrder.billed) {
                  this.totalShopsPaid += eventProductOrder.total!;
                  const z = this.shopsPaid.findIndex(x => x.id === shop.id);
                  if(z === -1) {
                    this.shopsPaid.push(shop);
                  }

                }
              });
              this.totalFeesShops = (this.totalShops / 100) * this.fees.feesSupplier!;
              this.totalFeesShopsPaid = (this.totalShopsPaid / 100) * this.fees.feesSupplier!;
              resolve();
            }
          });
      });
    });
   });
   return promise;
  }

  ngOnInit(): void {

    this.shops = [];
    this.events = [];
    this.services = [];

    this.shopsPaid = []
    this.eventsPaid = [];
    this.servicesPaid = [];

    this.totalEvents = 0;
    this.totalShops = 0;
    this.totalServices = 0;
    this.totalFeesEvents = 0;
    this.totalFeesShops = 0;
    this.totalFeesServices = 0;

    this.totalEventsPaid = 0;
    this.totalShopsPaid = 0;
    this.totalServicesPaid = 0;
    this.totalFeesEventsPaid = 0;
    this.totalFeesShopsPaid = 0;
    this.totalFeesServicesPaid = 0;

    this.adminFeesEventService.find(1).subscribe(a => {
      this.fees = a.body!;

       this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body!;
        this.type = 'fee';
        this.id = 1


        forkJoin([
          this.loadEvents(),
          this.loadOrganizationReservations(),
          this.loadShops(),
          this.loadServices(),
       ])
       .subscribe(t=> {
        this.onApproveAngular();
       });
      });
    });
  }

  genround(amt: number, prec: number): number {
    var rndd = Number((Math.round(amt / prec) * prec).toFixed(2));
    return rndd ;
  }

  onApproveAngular(): void {
    if(this.txId) {
      this.generalService.getStatusFromTransactionIdFromDatatrans(this.txId).subscribe(res => {
        const z = res.body;
        if(z.status === "authorized" || z.status === "settled") {
          forkJoin([
            this.updateEventProductOrders(),
            this.updateEvents(),
            this.updateServiceMapOrders(),
            this.updateOrganizationReservations()
         ])
         .subscribe(t=> {
          this.router.navigate(['/billing']);
          this.ngOnInit();
          this.loading = false;
         });
        }
      });
    } else {
      this.loading = false;
    }
  }

  previousState(): void {
    window.history.back();
  }


  updateEventProductOrders(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      if(!this.shops || this.shops.length === 0) {
        resolve();
      }
      // this.shops.forEach(s => {
      for(let i = 0; i < this.shops.length; i++) {
        const s = this.shops[i];
        if(!s.eventProductOrders || s.eventProductOrders.length === 0) {
          break;
        }
        let epoi = 0;
        s.eventProductOrders.forEach(epo => {
          epoi++;
          epo.billed = true;
          const fT = new FeeTransaction();
          fT.date = dayjs();
          fT.eventProductOrder = epo;
          const fte = new FeeTransactionEntry();
          fte.type = FeeType.EVENTPRODUCTORDER;
          fte.value = epo.total / 100 * this.fees.feesSupplier;
          if(fT.entries === null || fT.entries === undefined) {}  {
            fT.entries = [];
          }
          fT.entries.push(fte);
          const tid: FeeTransactionId = new FeeTransactionId();
          tid.transactionId = this.refNo;
          fT.transactionId = tid;
          this.feeTransactionService.create(fT).subscribe(res => {
            epo.feeTransaction = res.body;
            this.generalService.updateEventProductOrder(epo).subscribe(() => {
              if(epoi === s.eventProductOrders.length) {
                resolve();
              }
            });
          });
        });
      }
      // });
    });
    return promise;
  }

  updateServiceMapOrders(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      if(!this.services || this.services.length === 0){
        resolve();
      }
      let smi = 0;
      this.services.forEach(sm => {
        if(!sm.serviceMaps || sm.serviceMaps.length === 0){
          resolve();
        }
        smi++;
        sm.serviceMaps.forEach(sms => {
          if(sms.eventServiceMapOrders === null || sms.eventServiceMapOrders.length === 0) {
            resolve();
          }
          sms.eventServiceMapOrders.forEach(esmo => {
            esmo.billed = true;
            const fT = new FeeTransaction();
            fT.eventServiceMapOrder = esmo;
            fT.date = dayjs();
            const tid: FeeTransactionId = new FeeTransactionId();
            tid.transactionId = this.refNo;
            fT.transactionId = tid;
            const fte = new FeeTransactionEntry();
            fte.type = FeeType.EVENTSERVICEMAPORDER;
            fte.value = esmo.total / 100 * this.fees.feesService;
            if(fT.entries === null || fT.entries === undefined)  {
              fT.entries = [];
            }
            fT.entries.push(fte);
            this.feeTransactionService.create(fT).subscribe(fTR => {
              esmo.feeTransaction = fTR.body;
              this.generalService.updateEventServiceMapOrder(esmo).subscribe(() => {
                if(smi === this.services.length) {
                  resolve();
                }
              });
            });
          });
        });
      });
    });
    return promise;
  }

  updateEvents(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      if(!this.events || this.events.length === 0) {
        resolve();
      }
    this.events.forEach(e => {

    this.organisatorService.findReservationsByEventId(e.id).subscribe(res => {
      const reservations = res.body;
      e.billed = true;
      const fT = new FeeTransaction();
      fT.date = dayjs();
      fT.event = e;
      const tid: FeeTransactionId = new FeeTransactionId();
      tid.transactionId = this.refNo;
      fT.transactionId = tid;
      const fte = new FeeTransactionEntry();
      fte.type = FeeType.EVENT;
      fte.value = e.price * reservations.length / 100 * this.fees.feesOrganisator;
      if(fT.entries === null || fT.entries === undefined)  {
        fT.entries = [];
      }
      fT.entries.push(fte);
      this.feeTransactionService.create(fT).subscribe(res => {
        e.feeTransaction = res.body;
        this.generalService.updateEvent(e).subscribe(() => {
            resolve();
        });
      });
    });
    });
    });
    return promise;
  }

  updateOrganizationReservations(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      if(!this.organizationReservations || this.organizationReservations.length === 0) {
        resolve();
      }
    this.organizationReservations.forEach(e => {
      e.feeBilled = true;
      const fT = new FeeTransaction();
      fT.organizationReservation = e;
      fT.date = dayjs();
      const tid: FeeTransactionId = new FeeTransactionId();
      tid.transactionId = this.refNo;
      fT.transactionId = tid;
      const fte = new FeeTransactionEntry();
      fte.type = FeeType.ORGANIZATIONRESERVATION;
      fte.value = e.total / 100 * this.fees.feesOrganizations;
      if(fT.entries === null || fT.entries === undefined)  {
        fT.entries = [];
      }
      fT.entries.push(fte);
      this.feeTransactionService.create(fT).subscribe(res => {
        e.feeTransaction = res.body;
        this.generalService.updateOrganizationReservation(e).subscribe(() => {
            resolve();
        });
      });
    });
    });
    return promise;
  }

}
