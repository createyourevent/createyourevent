import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'app/general.service';
import * as dayjs from "dayjs";
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';


@Component({
  selector: 'jhi-cashbox',
  templateUrl: './cashbox.component.html',
  styleUrls: ['./cashbox.component.scss']
})
export class CashboxComponent implements OnInit {

  jhiEvent!: IEvent;
  productOrders!: IEventProductOrder[];
  servicemapOrders!: IEventServiceMapOrder[];
  filteredProductOrders: IEventProductOrder[] = [];
  filteredServicemapOrders: IEventServiceMapOrder[] = [];
  total: number;
  type: string;
  id: number;


  constructor(private generalService: GeneralService,
              private route: ActivatedRoute,
              private eventService: EventService,
              ) {
   }

  ngOnInit(): void {
    this.filteredProductOrders = [];
    this.filteredServicemapOrders  =  [];
    this.type = 'cashbox';
    let eventId: number;
    this.route.params.subscribe(params => {
      eventId = params['eventId'];
      this.id = eventId;
      this.eventService.find(eventId).subscribe(e => {
        this.jhiEvent = e.body!;

        this.generalService.findEventProductOrdersByEventId(eventId).subscribe(epo => {
          this.productOrders = epo.body!;

          this.productOrders.forEach(element => {
            if(!element.event.billedOrganisator) {
              this.filteredProductOrders.push(element);
            }
          });
        });

        this.generalService.getAllEventServiceMapsOrdersByEventId(eventId).subscribe(smo => {
          this.servicemapOrders = smo.body!;

          this.servicemapOrders.forEach(element => {
            if(!element.event.billedOrganisator) {
              this.filteredServicemapOrders.push(element);
            }
          });
        });
      })
    });
  }

  getTotalProductOrders(): number {
    let total = 0;
    this.filteredProductOrders.forEach(element => {
      total += element.product.price * element.amount;
    });
    return total;
  }

  getTotalServiceMapOrders(): number {
    let total = 0;
    let addedRideCosts = false ;
    this.filteredServicemapOrders.forEach(element => {
      total += element.total!;
      if(!addedRideCosts) {
        addedRideCosts = true;
        total += element.rideCosts!;
      }
    });
    return total;
  }

  getTotal(): number {
    this.total = this.genround((this.getTotalProductOrders() + this.getTotalServiceMapOrders()), 0.05);
    return this.total;
  }

  genround(amt: number, prec: number): number {
    var rndd = Number((Math.round(amt / prec) * prec).toFixed(2));
    return rndd ;
  }



  onApproveAngular(result: any): void {
    this.jhiEvent.billedOrganisator = true;
    this.eventService.update(this.jhiEvent).subscribe(() => {
      this.ngOnInit();
    });
  }

  cancel() {
    window.history.back();
  }
}
