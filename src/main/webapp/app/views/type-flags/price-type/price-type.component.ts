import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IProduct } from 'app/entities/product/product.model';


@Component({
  selector: 'jhi-price-type',
  templateUrl: './price-type.component.html',
  styleUrls: ['price-type.component.scss']
})
export class PriceTypeComponent implements OnChanges {
  @Input() product!: IProduct;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] !== undefined) {
      this.product = changes['product'].currentValue;
    }
  }
}
