import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IProduct } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-admin-calculation-product',
  templateUrl: './admin-calculation-product.component.html',
  styleUrls: ['admin-calculation-product.component.scss']
})
export class AdminCalculationProductComponent implements OnChanges {
  @Input() product!: IProduct;
  eventProductOrders!: IEventProductOrder[];

  constructor(private productService: ProductService, private generalService: GeneralService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] !== undefined) {
      this.product = changes['product'].currentValue;
      this.generalService.findEventProductOrdersByProductId(this.product.id!).subscribe(res => {
        this.eventProductOrders = res.body!;
      });
    }
  }
}
