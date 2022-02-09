import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { ICreateYourEventService } from "app/entities/create-your-event-service/create-your-event-service.model";
import { CreateYourEventServiceDeleteDialogComponent } from "app/entities/create-your-event-service/delete/create-your-event-service-delete-dialog.component";
import { CreateYourEventServiceService } from "app/entities/create-your-event-service/service/create-your-event-service.service";
import { GeneralService } from "app/general.service";
import { JhiDataUtils, JhiEventManager } from "ng-jhipster";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";


@Component({
  selector: 'jhi-service-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit, OnDestroy {

  createYourEventServices?: ICreateYourEventService[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private generalService: GeneralService,
    private createYourEventService: CreateYourEventServiceService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {}

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;
    this.generalService.findWidthAuthorities().subscribe(u => {
      const user = u.body;
      this.generalService
      .getServicesFromUserAndActive(
        user!.id!,
      {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<ICreateYourEventService[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError()
      );
    });

  }

  setServiceActive(e: any, id: number) {
    this.createYourEventService.find(id).subscribe(res => {
      const s = res.body;
      s.activeOwner = e.checked;
      this.createYourEventService.update(s).subscribe(su => {
        this.messageService.add({key: 'myKey1', severity:'error', summary: this.translate.instant('dashboard-supplier.service-active'), detail: this.translate.instant('dashboard-supplier.service-active')});
      });
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadPage();
    });
    this.registerChangeInCreateYourEventServices();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICreateYourEventService): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInCreateYourEventServices(): void {
    this.eventSubscriber = this.eventManager.subscribe('createYourEventServiceListModification', () => this.loadPage());
  }

  delete(createYourEventService: ICreateYourEventService): void {
    const modalRef = this.modalService.open(CreateYourEventServiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.createYourEventService = createYourEventService;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: ICreateYourEventService[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/service/dashboard'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.createYourEventServices = data || [];
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }

  serviceMaps(serviceId: number): void {
    this.router.navigate(['/service/service-maps/' + serviceId ]);
  }
}
