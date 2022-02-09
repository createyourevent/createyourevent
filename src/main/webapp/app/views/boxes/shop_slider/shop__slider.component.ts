import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IShop } from 'app/entities/shop/shop.model';

@Component({
  selector: 'jhi-shop-slider',
  templateUrl: './shop_slider.component.html',
  styleUrls: ['shop_slider.component.scss']
})
export class ShopSliderComponent {
  @Input() shops: IShop[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 3;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '600px';
  @Input() autoplayInterval = 3000;
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

  goToShop(shopId: number): void {
    this.router.navigate(['/supplier/shop/' + shopId + '/overview']);
  }
}
