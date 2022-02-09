import { Component, OnInit } from "@angular/core";
import { IAdminFeesPrice } from "app/entities/admin-fees-price/admin-fees-price.model";
import { AdminFeesPriceService } from "app/entities/admin-fees-price/service/admin-fees-price.service";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { EventProductOrderService } from "app/entities/event-product-order/service/event-product-order.service";
import { GeneralService } from "app/general.service";
import * as dayjs from "dayjs";

@Component({
  selector: 'jhi-supplier-billing',
  templateUrl: './suppllier_billing.component.html',
  styleUrls: ['./suppllier_billing.component.scss']
})
export class SupplierBillingComponent implements OnInit {

  eventProductOrders: IEventProductOrder[] = [];
  fees!: IAdminFeesPrice;
  feesSupplier = 0;
  selectedIds: string[] = [];
  loading: boolean = true;
  eventProductOrdersNotPaid: IEventProductOrder[] = [];



  constructor(
    private eventProductOrderService: EventProductOrderService,
    private adminFeesPriceService: AdminFeesPriceService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.generalService.findAllEventProductOrderByDateGreaterThen(dayjs()).subscribe(epo => {
      const eventProductOrders = epo.body!;
      eventProductOrders.forEach(ele => {
        if(ele.billed) {
          this.eventProductOrders.push(ele);
        } else {
          this.eventProductOrdersNotPaid.push(ele);
        }
      });

      this.adminFeesPriceService.find(1).subscribe(f =>  {
        this.fees = f.body!;

        this.feesSupplier = this.fees.feesSupplier!;
        this.loading = false;
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  changeCheckbox(e: any): void {
    this.selectedIds.forEach(element => {
      this.eventProductOrderService.find(Number(element)).subscribe(ev => {
        const evt = ev.body!;
        evt.billed = e.checked;
      });
    });
  }

  save(): void {
    this.selectedIds.forEach(element => {
      this.eventProductOrderService.find(Number(element)).subscribe(e => {
        const esmo = e.body!;
        if(Number(element) === esmo.id) {
          esmo.billed = true;
        } else {
          esmo.billed = false;
        }
        this.eventProductOrderService.update(esmo).subscribe();
      });
    });
  }
}
