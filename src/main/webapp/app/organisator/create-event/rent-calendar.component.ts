import { Component } from "@angular/core";
import { OnInit, OnDestroy } from "@angular/core";
import { PriceType } from "app/entities/enumerations/price-type.model";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { GeneralService } from "app/general.service";
import dayjs from "dayjs";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import deLocale from '@fullcalendar/core/locales/de';
import { MessageService } from "primeng/api";


@Component({
  selector: 'jhi-rent-calendar',
  templateUrl: './rent-calendar.component.html',

})
export class RentCalendarComponent implements OnInit{

  options: any;
  eventProductOrders: IEventProductOrder[] = [];
  constructor(private generalService: GeneralService, public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService) {}

  handleEventClick(arg) {
    let evs = 'Event start: ' + arg.event.start + '\n';
    let eve = 'Event end: ' + arg.event.end + '\n';
    this.messageService.add({severity:'success', summary:'Event date', detail: evs + eve});
  }


  ngOnInit(): void {

    this.options = {
      editable: true,
      theme: 'standart', // default view, may be bootstrap
      headerToolbar: {
        start: 'today prev,next', // will normally be on the left. if RTL, will be on the right
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay' // will normally be on the right. if RTL, will be on the left
      },
      locales: [ deLocale ],
      locale: 'de',
      // add other plugins
      eventClick: this.handleEventClick.bind(this),
      events: [],

    };

    this.generalService.findEventProductOrdersByProductId(this.config.data.id).subscribe(res => {
      let events = [];
      res.body.forEach(order => {
        if(order.product.priceType === PriceType.RENT)
        this.eventProductOrders.push(order);
        events.push({ title: order.product.title, start: dayjs(order.dateFrom).toISOString(), end: dayjs(order.dateUntil).toISOString()});
      });
      this.options.events = events;
    });


  }
}
