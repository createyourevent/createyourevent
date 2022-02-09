import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { PriceType } from "app/entities/enumerations/price-type.model";
import { EventProductOrderDeleteDialogComponent } from "app/entities/event-product-order/delete/event-product-order-delete-dialog.component";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { EventProductOrderService } from "app/entities/event-product-order/service/event-product-order.service";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { GeneralService } from "app/general.service";
import { MessageService } from "primeng/api";
import * as dayjs from "dayjs";
import { EventStatus } from 'app/entities/enumerations/event-status.model';
import { IProduct } from 'app/entities/product/product.model';


@Component({
  selector: 'jhi-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['edit-products.component.scss'],
  providers: [MessageService]
})
export class EditProductsComponent implements OnInit, OnDestroy {

  jhiEvent!: IEvent;

  eventProductOrders: IEventProductOrder[] = [];
  rowGroupMetadata: any;

  constructor(
    private route: ActivatedRoute,
    protected jhiEventService: EventService,
    private generalService: GeneralService,
    protected modalService: NgbModal,
    private router: Router,
    private messageService: MessageService,
    private eventOrderProductService: EventProductOrderService,
    private translate: TranslateService
  ) {}


  ngOnDestroy(): void {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.params['eventId'];
    this.jhiEventService.find(eventId).subscribe(ev => {
      this.jhiEvent = ev.body!;
      this.generalService.findEventProductOrdersByEventId(this.jhiEvent.id!).subscribe(epos => {
        this.eventProductOrders = epos.body!;
        this.updateRowGroupMetaData();
      });
    });
  }

  onSort(): void {
    this.updateRowGroupMetaData();
  }

  showAddProductButton(): boolean  {
    let show = false;
    const eventDateStart = dayjs(this.jhiEvent.dateStart);
    if(this.jhiEvent.definitelyConfirmed === false && this.jhiEvent.status === EventStatus.PROCESSING) {
      show = true;
    }
    return show;
  }

  updateRowGroupMetaData(): void {
    this.rowGroupMetadata = {};

    if (this.eventProductOrders) {
        for (let i = 0; i < this.eventProductOrders.length; i++) {
            const rowData = this.eventProductOrders[i];
            const productType = rowData.shop!.productType;

            if (i === 0) {
                this.rowGroupMetadata[productType!] = { index: 0, size: 1 };
            }
            else {
                const previousRowData = this.eventProductOrders[i - 1];
                const previousRowGroup = previousRowData.shop!.productType;
                if (productType === previousRowGroup)
                    this.rowGroupMetadata[productType!].size++;
                else
                    this.rowGroupMetadata[productType!] = { index: i, size: 1 };
            }
        }
    }
  }

  delete(eventProductOrder: IEventProductOrder): void {
    const modalRef = this.modalService.open(EventProductOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventProductOrder = eventProductOrder;

    modalRef.result.then(() => {
      this.ngOnInit();
    });
  }

  onBlurEvent(event: any, id: number): void{
    this.eventOrderProductService.find(id).subscribe(epo => {
      const epob = epo.body;
      epob.sellingPrice = Number(event.target.value.substring(4));
      if(epob.sellingPrice <= 0) {
        this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('edit-products.error'), detail: this.translate.instant('edit-products.not-allowed-selling-price') });
        return;
      }

      this.eventOrderProductService.update(epob).subscribe(e => {
        const ep = e.body;
        this.messageService.add({ key: 'myKey1', severity: 'success', summary: this.translate.instant('edit-products.success'), detail: this.translate.instant('edit-products.selling-price-updated') });
        });
    });
 }

 onBlurAmountEvent(event: any, id: number): void{
  this.eventOrderProductService.find(id).subscribe(epo => {
    const epob = epo.body;
    const amountOld = epob.amount;
    const amountNew = event.target.value;
    let diff_old_new = amountNew - amountOld;
    if(diff_old_new < 0) {
      diff_old_new *= -1;
    }

    if(amountNew <= 0) {
      this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('edit-products.error'), detail: this.translate.instant('edit-products.not-allowed-amount') });
      return;
    }

    if(amountOld === amountNew) {
      this.messageService.add({ key: 'myKey1', severity: 'success', summary: this.translate.instant('edit-products.success'), detail: this.translate.instant('edit-products.product-updated') });
      return;
    }

    if(epob.product.priceType === PriceType.SELL && epob.product.stock >= 0) {
      epob.amount = amountNew;
      epob.total = amountNew * epob.product.price;
      this.eventOrderProductService.update(epob).subscribe(e => {
        const ep = e.body;
        this.messageService.add({ key: 'myKey1', severity: 'success', summary: this.translate.instant('edit-products.success'), detail: this.translate.instant('edit-products.product-updated') });
        });
    } else if(epob.product!.priceType === PriceType.RENT && epob.product.stock >= 0) {

      const dateFrom = dayjs(epob.dateFrom!);
      const dateUntil = dayjs(epob.dateUntil!);

      if (!dateFrom.isValid() || !dateUntil.isValid()) {
        this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('select-products.error'), detail: this.translate.instant('select-products.error-date') });
        return;
      }

      let arr1: IEventProductOrder[] = [];
      let arr2: IEventProductOrder[] = [];
      let arr3: IEventProductOrder[] = [];
      let arr4: IEventProductOrder[] = [];
      this.generalService.findAllEventProductOrdersWithDateFromRange(dateFrom, dateUntil).subscribe(epo1 => {
        arr1 = epo1.body!;
        this.generalService.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(dateFrom, dateUntil).subscribe(epo2 => {
          arr2 = epo2.body!;
          this.generalService.findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(dateFrom, dateUntil).subscribe(epo3 => {
            arr3 = epo3.body!;
            this.generalService.findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(dateFrom, dateUntil).subscribe(epo4 => {
              arr4 = epo4.body!;

              const arrFinal = arr1.concat(arr2).concat(arr3).concat(arr4);
              const arrUnique = this.getUniqueListBy(arrFinal, 'id');

              let t = 0;
              arrUnique.forEach(element => {
                t += element.amount!;
              });

              if (epob.product!.stock! - t - diff_old_new < 0) {
                this.messageService.add({ key: 'myKey1', severity: 'error', summary: this.translate.instant('edit-products.error'), detail: this.translate.instant('edit-products.not-enought-quantity-in-time') });
                return;
              }

              epob.amount = amountNew;
              epob.total = amountNew * epob.product!.price!;
              this.eventOrderProductService.update(epob).subscribe(() => {
              this.messageService.add({ key: 'myKey1', severity: 'success', summary: this.translate.instant('edit-products.successful'), detail: this.translate.instant('edit-products.product-updated') });
              });


            });
          });
        });
      });
    }
  });
}

  getUniqueListBy(arr: any[], key: any): IEventProductOrder[] {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  addProduct(): void {
    this.router.navigate(['/events/' + this.jhiEvent.id + '/add-product']);
  }

  previousState(): void {
    this.router.navigate(['/events/' + this.jhiEvent.id + '/edit']);
  }
}
