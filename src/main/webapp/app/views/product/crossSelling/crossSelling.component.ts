import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IEvent } from 'app/entities/event/event.model';
import { IProduct } from 'app/entities/product/product.model';
import { GeneralService } from 'app/general.service';
import { OrganisatorService } from 'app/organisator/organisator.service';

@Component({
  selector: 'jhi-cross-selling',
  templateUrl: './crossSelling.component.html',
  styleUrls: ['./crossSelling.component.scss']
})
export class CrossSellingComponent implements OnChanges {
  @Input() product!: IProduct;
  eventProductOrders!: IEventProductOrder[];
  events: IEvent[] = [];
  products: IProduct[] = [];
  loaded = false;

  constructor(private generalService: GeneralService, private organisatorService: OrganisatorService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] !== undefined) {
      this.product = changes['product'].currentValue;
      this.loadEventProductOrders().then(() => {
        this.loadEvents().then(() => {
          this.loadCrossSellingProducts().then(() => {
            this.loaded = true;
          });
        });
      });
    }
  }

  loadEventProductOrders(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.generalService
        .findEventProductOrdersByProductId(this.product.id!)
        .toPromise()
        .then(res => {
          this.eventProductOrders = res.body!;
          resolve();
        });
    });
    return promise;
  }

  loadEvents(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.eventProductOrders.forEach(element => {
        this.events.push(element.event!);
      });
      resolve();
    });
    return promise;
  }

  loadProducts(id: number): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.generalService
        .findEventProductOrdersByEventId(id)
        .toPromise()
        .then(res => {
          res.body!.forEach(epo => {
            if (epo.id !== this.product.id) {
              this.products.push(epo.product!);
            }
          });
          resolve();
        });
    });
    return promise;
  }

  loadCrossSellingProducts(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let i = 0;
      this.events.forEach(ele => {
        i++;
        this.loadProducts(ele.id!).then(() => {
          if (this.events.length === i) {
            const prodsUnique = this.getUniqueListBy(this.products, 'id');
            this.products = prodsUnique.sort(() => Math.random() - 0.5);
            resolve();
          }
        });
      });
    });
    return promise;
  }

  getUniqueListBy(arr: any[], key: any): IProduct[] {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  }
}
