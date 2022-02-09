import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IShop } from 'app/entities/shop/shop.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';


@Component({
  selector: 'jhi-admin-reservations-shop',
  templateUrl: './admin-reservations-shop.component.html',
  styleUrls: ['admin-reservations-shop.component.scss']
})
export class AdminReservationsShopComponent implements OnInit, OnDestroy, OnChanges {

  @Input() shop!: IShop;
  @Input() user!: IUser;
  allReservations: IEventProductOrder[] = [];



  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
   if(this.shop && this.user) {
    this.generalService.findAllEventProductOrdersByShopId(this.shop.id!).subscribe(res => {
      const allOrders = res.body!;
      allOrders.forEach(order => {
        if(order.dateFrom && order.dateUntil) {
          this.allReservations.push(order);
        }
      });
    });
   }
  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shop'] !== undefined) {
      this.shop = changes['shop'].currentValue;
      this.ngOnInit();
    }
    if (changes['user'] !== undefined) {
      this.user = changes['user'].currentValue;
      this.ngOnInit();
    }
  }
}
