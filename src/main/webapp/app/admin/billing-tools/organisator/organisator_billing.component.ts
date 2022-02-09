import { Component, OnInit } from "@angular/core";
import { IAdminFeesPrice } from "app/entities/admin-fees-price/admin-fees-price.model";
import { AdminFeesPriceService } from "app/entities/admin-fees-price/service/admin-fees-price.service";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { GeneralService } from "app/general.service";
import * as dayjs from "dayjs";
import { Table } from "primeng/table";

declare const google: any;

@Component({
  selector: 'jhi-organisator-billing',
  templateUrl: './organisator_billing.component.html',
  styleUrls: ['./organisator_billing.component.scss']
})
export class OrganisatorBillingComponent implements OnInit {


  events: IEvent[] = [];
  eventsNotPaid: IEvent[] = [];
  fees!: IAdminFeesPrice;
  feesEvent!: number;
  selectedIds: string[] = [];
  loading: boolean = true;


  constructor(
    private eventService: EventService,
    private generalService: GeneralService,
    private adminFeesPriceService: AdminFeesPriceService
  ) {}

  ngOnInit(): void {
    this.generalService.findEventyByPrivateOrPublicAndActiveTrueAndDateEndBefor(dayjs()).subscribe(res => {
      const events = res.body!;

      events.forEach(element => {
        if(element.billed) {
          this.selectedIds.push("" + element.id);
          this.events.push(element);
        } else {
          this.eventsNotPaid.push(element);
        }
      });
      this.loading = false;
    });

    this.adminFeesPriceService.find(1).subscribe(f => {
      this.fees = f.body!;

      this.feesEvent = this.fees.feesOrganisator!;
    });
  }

  previousState(): void {
    window.history.back();
  }

  changeCheckbox(e: any): void {
    this.selectedIds.forEach(element => {
      this.eventService.find(Number(element)).subscribe(ev => {
        const evt = ev.body!;
        evt.billed = e.checked;
      });
    });
  }

  save(): void {
    this.selectedIds.forEach(element => {
      this.eventService.find(Number(element)).subscribe(e => {
        const jhiEvent = e.body!;
        if(Number(element) === jhiEvent.id) {
          jhiEvent.billed = true;
        } else {
          jhiEvent.billed = false;
        }
        this.eventService.update(jhiEvent).subscribe();
        window.history.back();
      });
    });
  }

  clear(table: Table) {
    table.clear();
}

}
