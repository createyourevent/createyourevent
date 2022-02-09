import { OnChanges, SimpleChanges, Component, Input } from '@angular/core';
import { SharedChatService } from 'app/chat.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IShop } from 'app/entities/shop/shop.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-admin-calculation-shop',
  templateUrl: './admin-calculation-shop.component.html',
  styleUrls: ['admin-calculation-shop.component.scss']
})
export class AdminCalculationShopComponent implements OnChanges {
  @Input() shop!: IShop;
  products!: IProduct[];

  constructor(private generalService: GeneralService, private productService: ProductService, private sharedChatService: SharedChatService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shop'] !== undefined) {
      this.shop = changes['shop'].currentValue;

      this.generalService.findAllProductsByShopId(this.shop.id!).subscribe(res => {
        this.products = res.body!;
        this.products.forEach(element => {
          this.generalService.findEventProductOrdersByProductId(element.id!).subscribe(epo => {
            element.eventProductOrders = epo.body!;
          });
        });
      });
    }
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  handleChange(e: any, id: number): void {
    this.productService.find(id).subscribe(res => {
      const prod = res.body!;
      prod.active = e.checked;
      this.productService.update(prod).subscribe();
    });
  }

  setStock(event: any, productId: number): void {
    this.productService.find(productId).subscribe(res => {
      const product = res.body;
      product!.stock = Number(event.target.value);
      this.productService.update(product!).subscribe();
    })
  }
}
