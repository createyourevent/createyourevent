import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { IEvent } from "app/entities/event/event.model";
import { IProduct } from "app/entities/product/product.model";
import { IShop } from "app/entities/shop/shop.model";
import { GeneralService } from "app/general.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import { Subscription, interval } from "rxjs";
import * as dayjs from "dayjs";


@Component({
  selector: 'jhi-createyourevent-tv',
  templateUrl: './createyourevent-tv.component.html',
  styleUrls: ['./createyourevent-tv.component.scss']
})
export class CreateyoureventTvComponent implements OnDestroy, OnInit {
  @Input() allEvents: IEvent[] = [];
  @Input() products: IProduct[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 1;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '419px';
  @Input() autoplayInterval = 10000;
  @Input() style = "{ width: '548px' }";
  loaded = false;
  starEvents: any[] = [];
  counter = 300;
  responsiveOptions: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private organisatorService: OrganisatorService, private generalService: GeneralService) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {
    const now = dayjs();
    this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(now).subscribe(events => {
      this.allEvents = events.body!.sort(() => Math.random() - 0.5);

      this.allEvents.forEach(e => {
        this.organisatorService.findReservationsByEventId(e.id!).subscribe(r => {
          e.reservations = r.body;
          this.generalService.findEventTags(e.id!).subscribe(t => {
            e.tags = t.body;
          });
        });

        this.generalService.getEventStarRatingByEvent(e.id!).subscribe(res => {
          const ratings = res.body!;
          let total = 0;
          ratings.forEach(el => {
            total += el.stars!;
          });
          let avg = (total / ratings.length / 10) * 5;
          if(ratings.length === 0) {
            avg = 0;
          }
          this.starEvents.push({ event: e, average: avg, total: ratings.length });
        });
      });
    });

    this.generalService.findShopByActiveTrueAndActiveOwnerTrue().subscribe(s => {
      const shops = s.body;
      this.loadProducts(shops!).then(res => {
        res.forEach(element => {
          this.products = this.products.concat(element.products!);
          this.products.sort(() => Math.random() - 0.5);
          this.products.forEach(p => {
            this.generalService.findProductTags(Number(p.id!)).subscribe(t => {
              p.tags = t.body;
            });
          });
        });
      });
    });

    this.subscription = interval(1000).subscribe(x => {
      this.counter--;
      if (this.counter === 0) {
        this.counter = 300;
      }
    });
  }

  loadProducts(shops: IShop[]): Promise<IShop[]> {
    let p = new Promise<IShop[]>((resolve, reject) => {
      let i = 0;
      shops.forEach(shop => {
        // const products: IProduct[] = [];
        this.generalService.findAllProductsByShopId(shop.id!).subscribe(p => {
          i++;
          const prods = p.body;
          /*
          prods.forEach(element => {
            if(element.active === true) {
              products.push(element);
            }
          });
          */
          shop.products = prods;
          if (i === shops.length) {
            resolve(shops);
          }
        });
      });
    });
    return p;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/events/' + eventId + '/view']);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products/' + productId + '/view']);
  }

  getAverage(eventId: number): number {
    const se = this.starEvents.find(x => x.event.id === eventId);
    return se.average;
  }

  getRatingsTotal(eventId: number) {
    const se = this.starEvents.find(x => x.event.id === eventId);
    return se.total;
  }
}
