import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProductType } from "app/entities/enumerations/product-type.model";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IEventProductRatingComment } from "app/entities/event-product-rating-comment/event-product-rating-comment.model";
import { IEvent } from "app/entities/event/event.model";
import { IProduct } from "app/entities/product/product.model";
import { EventService as EventUserService } from "../event.service";
import { AdminCommentsEventProductComponent } from "./admin-comments-event-product.component";


@Component({
  selector: 'jhi-admin-comments-event',
  templateUrl: './admin-comments-event.component.html',
  styleUrls: ['admin-comments-event.component.scss']
})
export class AdminCommentsEventComponent implements OnChanges {
  @Input() jhiEvent!: IEvent;

  comments: IEventProductRatingComment[] = [];
  realEstateProducts: IEventProductOrder[] = [];
  foodProducts: IEventProductOrder[] = [];
  drinkProducts: IEventProductOrder[] = [];
  musicProducts: IEventProductOrder[] = [];
  lightshowProducts: IEventProductOrder[] = [];
  decorationProducts: IEventProductOrder[] = [];
  miscellaneousProducts: IEventProductOrder[] = [];

  constructor(protected eventUserService: EventUserService, private modalService: NgbModal) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jhiEvent']) {
      this.eventUserService.getProductsWithEventId(this.jhiEvent.id!).subscribe(epo => {
        epo.body?.forEach(eventProductOrder => {
          if (eventProductOrder.product!.shop?.productType === ProductType.REAL_ESTATE) {
            this.realEstateProducts.push(eventProductOrder);
          }
          if (eventProductOrder.product!.shop?.productType === ProductType.FOOD) {
            this.foodProducts.push(eventProductOrder);
          }
          if (eventProductOrder.product!.shop?.productType === ProductType.DRINK) {
            this.drinkProducts.push(eventProductOrder);
          }
          if (eventProductOrder.product!.shop?.productType === ProductType.MUSIC) {
            this.musicProducts.push(eventProductOrder);
          }
          if (eventProductOrder.product!.shop?.productType === ProductType.LIGHTSHOW) {
            this.lightshowProducts.push(eventProductOrder);
          }
          if (eventProductOrder.product!.shop?.productType === ProductType.DECORATION) {
            this.decorationProducts.push(eventProductOrder);
          }
          if (eventProductOrder.product!.shop?.productType === ProductType.MISCELLANEOUS) {
            this.miscellaneousProducts.push(eventProductOrder);
          }
        });
      });
    }
  }

  open(product: IProduct): void {
    const modalRef = this.modalService.open(AdminCommentsEventProductComponent, { windowClass: 'productEventModal' });
    modalRef.componentInstance.event = this.jhiEvent;
    modalRef.componentInstance.product = product;
  }
}
