import { Component, OnInit } from "@angular/core";
import { IAdminFeesPrice } from "app/entities/admin-fees-price/admin-fees-price.model";
import { AdminFeesPriceService } from "app/entities/admin-fees-price/service/admin-fees-price.service";
import { IEventServiceMapOrder } from "app/entities/event-service-map-order/event-service-map-order.model";
import { EventServiceMapOrderService } from "app/entities/event-service-map-order/service/event-service-map-order.service";
import { EventService } from "app/entities/event/service/event.service";
import { GeneralService } from "app/general.service";
import * as dayjs from "dayjs";


declare const google: any;

@Component({
  selector: 'jhi-service-billing',
  templateUrl: './service_billing.component.html',
  styleUrls: ['./service_billing.component.scss']
})
export class ServiceBillingComponent implements OnInit {


  serviceMapsOrders!: IEventServiceMapOrder[];
  serviceFees!: number;
  fees!: IAdminFeesPrice;
  selectedIds: string[] = [];
  loading: boolean = true;


  constructor(
    private eventServiceMapOrderService: EventServiceMapOrderService,
    private adminFeesPriceService: AdminFeesPriceService,
    private generalService: GeneralService ) {}

  ngOnInit(): void {
    this.generalService.findEventServiceMapOrdersByEventDateEndSmallerThenNow().subscribe(esmo => {
      this.serviceMapsOrders =  esmo.body!;

      this.adminFeesPriceService.find(1).subscribe(f => {
        this.fees = f.body!;

        this.serviceFees = this.fees.feesService!;
        this.loading = false;
      })
    });

  }

  previousState(): void {
    window.history.back();
  }

  changeCheckbox(e: any): void {
    this.selectedIds.forEach(element => {
      this.eventServiceMapOrderService.find(Number(element)).subscribe(ev => {
        const evt = ev.body!;
        evt.billed = e.checked;
      });
    });
  }

  save(): void {
    this.selectedIds.forEach(element => {
      this.eventServiceMapOrderService.find(Number(element)).subscribe(e => {
        const esmo = e.body!;
        if(Number(element) === esmo.id) {
          esmo.billed = true;
        } else {
          esmo.billed = false;
        }
        this.eventServiceMapOrderService.update(esmo).subscribe();
      });
    });
  }
}
