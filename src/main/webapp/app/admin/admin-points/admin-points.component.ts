import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { PointDeleteDialogComponent } from "app/entities/point/delete/point-delete-dialog.component";
import { IPoint } from "app/entities/point/point.model";
import { PointService } from "app/entities/point/service/point.service";
import { JhiDataUtils, JhiEventManager } from "ng-jhipster";
import { Subscription } from "rxjs";


@Component({
  selector: 'jhi-admin-points',
  templateUrl: './admin-points.component.html',
  styleUrls: ['./admin-points.component.scss']
})
export class AdminPointsComponent implements OnInit, OnDestroy {
  points?: IPoint[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected pointService: PointService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;

    this.pointService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IPoint[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadPage();
    });
    this.registerChangeInPoints();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPoint): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInPoints(): void {
    this.eventSubscriber = this.eventManager.subscribe('pointListModification', () => this.loadPage());
  }

  delete(point: IPoint): void {
    const modalRef = this.modalService.open(PointDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.point = point;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IPoint[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/point'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.points = data || [];
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
