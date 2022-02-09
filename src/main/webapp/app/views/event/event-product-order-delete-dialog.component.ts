import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { EventProductOrderService } from 'app/entities/event-product-order/service/event-product-order.service';
import { ProductService } from 'app/entities/product/service/product.service';
import { JhiEventManager } from 'ng-jhipster';



@Component({
  templateUrl: './event-product-order-delete-dialog.component.html'
})
export class EventProductOrderDeleteDialogComponent {
  eventProductOrder?: IEventProductOrder;

  constructor(
    protected eventProductOrderService: EventProductOrderService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    private productService: ProductService
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventProductOrderService.find(id).subscribe(res => {
      const epo = res.body!;

      if(epo.product!.priceType === PriceType.SELL && epo.product!.stock! >= 0) {
        epo.product!.stock! += epo.amount!;
        this.productService.update(epo.product!).subscribe(() => {
          this.eventProductOrderService.delete(id).subscribe(() => {
            this.activeModal.close();
          });
        });
      } else  if(epo.product!.priceType === PriceType.SELL && epo.product!.stock! < 0) {
        this.productService.update(epo.product!).subscribe(() => {
          this.eventProductOrderService.delete(id).subscribe(() => {
            this.activeModal.close();
          });
        });
      } else if(epo.product!.priceType === PriceType.RENT) {
        this.eventProductOrderService.delete(id).subscribe(() => {
          this.activeModal.close();
        });
      }
    });
  }
}
