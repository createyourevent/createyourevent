import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'app/entities/product/product.model';

@Component({
  selector: 'jhi-product-slider',
  templateUrl: './product_slider.component.html',
  styleUrls: ['product_slider.component.scss']
})
export class ProductSliderComponent{


  @Input() products: IProduct[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 4;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '600px';
  @Input() autoplayInterval = 5000;
  @Input() style = "{ 'max-width': '1180px' }";


  responsiveOptions: any[] = [];

  constructor(private router: Router) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products/' + productId + '/view']);
  }
}
