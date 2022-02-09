import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IEventServiceMapOrder } from "app/entities/event-service-map-order/event-service-map-order.model";
import { SharedEventService } from "app/organisator/create-event/shared-event.service";


@Component({
  selector: 'jhi-shopping-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  model: any = {};
  display!: boolean;
  selectedEventProductOrders!: IEventProductOrder[];
  selectedEventServiceMapOrders!: IEventServiceMapOrder[];
  showCartButton = false;

  constructor(private sharedEventService: SharedEventService, private router: Router) {}

  ngOnInit(): void {
    this.model = this.sharedEventService.sharedEvent;
    this.selectedEventProductOrders = this.sharedEventService.selectedEventProductOrders;
    this.selectedEventServiceMapOrders = this.sharedEventService.selectedEventServiceMapOrders;

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (
          event.url.includes('/organisator/create-event/select-products') ||
          event.url.includes('/organisator/create-event/select-services') ||
          event.url.includes('/organisator/create-event/overview')
        ) {
          this.showCartButton = true;
        } else {
          this.showCartButton = false;
        }
      }
    });
  }

  ngOnDestroy(): void {}

  getTotalProducts(): number {
    let t = 0;
    this.selectedEventProductOrders.forEach(epo => {
      t += epo.total!;
    });
    return t;
  }

  getTotalServices(): number {
    let t = 0;
    this.selectedEventServiceMapOrders.forEach(esmo => {
      t += esmo.total!;
    });
    return t;
  }

  getInvestment(): number {
    return Number(this.sharedEventService.sharedEvent.investment);
  }

  calcRevenue(): number {
    return Number(this.sharedEventService.sharedEvent.price) * Number(this.sharedEventService.sharedEvent.placenumber);
  }

  maximumInCart(): number {
    return this.calcRevenue() + this.getInvestment() - this.getTotalProducts() - this.getTotalServices();
  }
}
