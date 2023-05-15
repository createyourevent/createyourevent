import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedChatService } from 'app/chat.service';
import { EventStatus } from 'app/entities/enumerations/event-status.model';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { EventProductOrderService } from 'app/entities/event-product-order/service/event-product-order.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IShop } from 'app/entities/shop/shop.model';
import { IUser } from 'app/entities/user/user.model';
import { EventService } from 'app/views/event/event.service';
import * as dayjs from 'dayjs';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'jhi-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['orders.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  shopId!: string;
  shop!: IShop;
  selledProducts: IEventProductOrder[] = [];
  provisionallySoldProducts: IEventProductOrder[] = [];
  clickSeen = false;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected productService: ProductService,
    protected eventService: EventService,
    protected shopService: ShopService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private eventProductOrderService: EventProductOrderService,
    private sharedChatService: SharedChatService
  ) {}

  previousState(): void {
    window.history.back();
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id')!;
    this.shopService.find(Number(this.shopId)).subscribe(s => {
      this.shop = s.body!;
      let products: IProduct[] = [];
      this.supplierService.queryProductsFromShop(Number(this.shop.id)).subscribe(prods => {
        products = prods.body!;
        let i = 0;
        products.forEach(product => {
          i++;
          this.supplierService.queryEventProductOrdersByProduct(product.id!).subscribe(epos => {
            let l = 0;
            epos.body.forEach(epo => {
              l++;
              if (dayjs(epo.event.dateStart).isAfter(dayjs()) && epo.event.status === EventStatus.PROCESSING) {
                this.provisionallySoldProducts.push(epo);
              } else if (
                dayjs(epo.event.dateStart).isAfter(dayjs()) &&
                epo.event.status === EventStatus.DEFINITELY &&
                epo.event.definitelyConfirmed === true
              ) {
                this.selledProducts.push(epo);
              }
              if (i === products.length && l === epos.body.length) {
                this.provisionallySoldProducts = this.provisionallySoldProducts.sort(function (a, b) {
                  return a.event.name.localeCompare(b.event.name);
                });
                this.provisionallySoldProducts = this.provisionallySoldProducts.sort(function (a, b) {
                  return a.user.id.localeCompare(b.user.id);
                });
                this.selledProducts = this.selledProducts.sort(function (a, b) {
                  return a.event.name.localeCompare(b.event.name);
                });
                this.selledProducts = this.selledProducts.sort(function (a, b) {
                  return a.user.id.localeCompare(b.user.id);
                });
              }
            });
          });
        });
      });
    });
  }

  ngOnDestroy(): void {}

  seenChange(event: any, id: number): void {
    this.clickSeen = true;
    this.eventProductOrderService.find(id).subscribe(epo => {
      const eventProductOrder = epo.body;
      eventProductOrder.seen = true;
      this.eventProductOrderService.update(eventProductOrder).subscribe(() => {
        this.clickSeen = false;
      });
    });
  }

  approvedChange(event: any, id: number): void {
    this.eventProductOrderService.find(id).subscribe(epo => {
      const eventProductOrder = epo.body;
      eventProductOrder.approved = true;

      this.eventProductOrderService.update(eventProductOrder).subscribe();
    });
  }
}
