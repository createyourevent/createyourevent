import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IProduct } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { ShopService } from "app/entities/shop/service/shop.service";
import { IShop, Shop } from "app/entities/shop/shop.model";
import { GeneralService } from "app/general.service";
import { ProductDeleteDialogComponent } from "app/views/product/product-delete-dialog.component";
import { JhiEventManager } from "ng-jhipster";
import { Subscription } from "rxjs";
import { SupplierService } from "../supplier.service";


@Component({
  selector: 'jhi-overview-product',
  templateUrl: './overview-product.component.html',
  styleUrls: ['./overview-product.component.scss']
})
export class OverviewProductComponent implements OnInit {
  products: IProduct[] = [];
  shop: IShop = new Shop();
  eventSubscriber?: Subscription;
  searchText = '';

  constructor(
    protected shopService: ShopService,
    protected productService: ProductService,
    protected supplierService: SupplierService,
    private route: ActivatedRoute,
    protected modalService: NgbModal,
    protected eventManager: JhiEventManager,
    private cdr: ChangeDetectorRef,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    const shopId = this.route.snapshot.paramMap.get('id')!;
    this.shopService.find(Number(shopId)).subscribe(res => {
      this.shop = res.body!;
      this.loadPage();
      this.registerChangeInProducts();
    });
  }

  loadPage(): void {
    this.generalService.findAllProductsByShopId(this.shop.id!).subscribe(resp => {
      this.products = resp.body!;
    });
  }

  delete(product: IProduct): void {
    const modalRef = this.modalService.open(ProductDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.product = product;
    this.cdr.detectChanges();
  }

  registerChangeInProducts(): void {
    this.eventSubscriber = this.eventManager.subscribe('productListModification', () => this.loadPage());
  }

  previousState(): void {
    window.history.back();
  }
}
