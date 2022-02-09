import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { Reservation } from 'app/entities/reservation/reservation.model';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BuyTicketDatatransComponent } from './buy-ticket-datatrans/buy-ticket-datatrans.component';

@Component({
  selector: 'jhi-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.scss'],
  providers:[MessageService, DialogService]
})
export class BuyTicketComponent implements OnInit {

  jhiEvent: IEvent;
  user: IUser;

  amount: number;

  datatransTrxId: string;

  ref: DynamicDialogRef;

  allSelledTickets: ITicket[] = [];



  constructor(private messageService: MessageService, private route: ActivatedRoute, private generalService: GeneralService, private eventService: EventService, public dialogService: DialogService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = params['eventId'];
      this.eventService.find(eventId).subscribe(e => {
        this.jhiEvent = e.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          this.user = u.body;
        });

        this.generalService.findTicketsByEventId(this.jhiEvent.id).subscribe(t => {
          this.allSelledTickets = t.body;
        });

      });
      });
  }

  totalTickets(): number {
    let total = 0;
    this.allSelledTickets.forEach(ticket => {
      total += ticket.amount;
    });
    return total;
  }

  enoughtTickets(): boolean {
    if((this.jhiEvent.placenumber - this.totalTickets()) - this.amount < 0) {
      return false;
    }
    return true;
  }

  changeAmount(e: number): void {
    if((this.jhiEvent.placenumber - this.totalTickets()) - e < 0) {
      this.messageService.add({severity:'error', summary:'Not enought tickets to sell', detail:'There aren\'t as many tickets left for this event as you\'d like. We are sorry.'});
    }
  }

  openPayment(): void {
    this.ref = this.dialogService.open(BuyTicketDatatransComponent, {
      header: 'Datatrans-Terminal',
      width: '70%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10,
      data: {
        event: this.jhiEvent,
        user: this.user,
        type: 'buyTicket',
        id: this.jhiEvent.id,
        amount: this.amount
      }
    });
  }

}
