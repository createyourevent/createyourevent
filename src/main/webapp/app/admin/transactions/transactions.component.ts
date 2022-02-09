import { Component, OnInit } from '@angular/core';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { FeeTransaction, IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { FeeTransactionService } from 'app/entities/fee-transaction/service/fee-transaction.service';
import { OrganisatorService } from 'app/organisator/organisator.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'jhi-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {


  events: IEvent[];
  selectedEvent: IEvent;
  loading: boolean = true;

  feeTransactions: IFeeTransaction[];

  feeTransactionsFromEventProductOrders: IFeeTransaction[] = [];
  feeTransactionsFromServiceMapOrders: IFeeTransaction[] = [];
  feeTransactionsFromEvent: IFeeTransaction[] = [];

  config = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
  }

  constructor(private eventService: EventService,
              private organisationService: OrganisatorService,
              private feeTransactionService: FeeTransactionService) { }

  ngOnInit(): void {
    this.eventService.query().subscribe(e => {
      this.events = e.body;
      this.events.forEach(ele => {
        this.organisationService.findReservationsByEventId(ele.id).subscribe(r => {
          ele.reservations = r.body;
          this.loading = false;
        });
      });
    });

    this.feeTransactionService.query().subscribe(ft =>   {
      this.feeTransactions = ft.body;
      this.feeTransactions.forEach(el => {
        if(el.eventProductOrder !== null) {
          this.feeTransactionsFromEventProductOrders.push(el);
        } else if(el.eventServiceMapOrder !== null) { //
          this.feeTransactionsFromServiceMapOrders.push(el);
        } else {
          this.feeTransactionsFromEvent.push(el);
        }
      });
    });

  }

  clear(table: Table) {
    table.clear();
  }

}
