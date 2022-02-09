import { ShopService } from 'app/entities/shop/service/shop.service';
import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { ShopDeleteDialogComponent } from "app/entities/shop/delete/shop-delete-dialog.component";
import { IShop } from "app/entities/shop/shop.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { JhiEventManager } from "ng-jhipster";
import { Subscription } from "rxjs";
import { SupplierDashboardService } from "./dashboard.service";
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { IProduct } from 'app/entities/product/product.model';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';


@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  shops?: IShop[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  user: IUser;
  disabled = true;

  constructor(
    protected supplierDashboardService: SupplierDashboardService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private generalService: GeneralService,
    private shopService: ShopService,
    private translate: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.activatedRoute.data.subscribe(data => {
        this.page = data.pagingParams.page;
        this.ascending = data.pagingParams.ascending;
        this.predicate = data.pagingParams.predicate;
        this.ngbPaginationPage = data.pagingParams.page;
        this.loadPage();
      });
    this.registerChangeInShops();
    });
  }

  setShopActive(e: any, id: number) {
    this.shopService.find(id).subscribe(res => {
      const shop = res.body;
      shop.activeOwner = e.checked;
      this.shopService.update(shop).subscribe(su => {
        this.messageService.add({key: 'myKey1', severity:'error', summary: this.translate.instant('dashboardService.service-active'), detail: this.translate.instant('dashboardService.service-active')});
      });
    });
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;

    this.generalService
      .findShopsByUserAndActiveTrue(
      {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IShop[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError()
      );
  }

  delete(shop: IShop): void {
    const modalRef = this.modalService.open(ShopDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.shop = shop;
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IShop): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInShops(): void {
    this.eventSubscriber = this.eventManager.subscribe('shopListModification', () => this.loadPage());
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IShop[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/supplier/dashboard'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.shops = data || [];
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
