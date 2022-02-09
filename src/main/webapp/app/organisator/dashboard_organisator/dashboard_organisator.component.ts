import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { IEvent } from "app/entities/event/event.model";
import { GeneralService } from "app/general.service";
import { EventDeleteDialogComponent } from "app/views/event/event-delete-dialog.component";
import { EventService } from "app/views/event/event.service";
import { JhiEventManager } from "ng-jhipster";
import { Subscription } from "rxjs";
import { OrganisatorDashboardService } from "./dashboard_organisator.service";


@Component({
  selector: 'jhi-dashboard-organisator',
  templateUrl: './dashboard_organisator.component.html',
  styleUrls: ['./dashboard_organisator.component.scss']
})
export class DashboardOrganisatorComponent implements OnInit, OnDestroy {
  events!: IEvent[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  status = false;

  constructor(
    private organisatorDashboardService: OrganisatorDashboardService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private generalService: GeneralService
  ) {
    this.events = [];
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;
    this.generalService.findWidthAuthorities().subscribe(u => {
      const user = u.body!;
      this.generalService.getEventsFromUserAndActive(user.id).subscribe(e => {
        this.events = e.body!;
      });
    });

    this.organisatorDashboardService
      .queryByUserAndActive({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IEvent[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
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
    this.registerChangeInEvents();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEvent): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEvents(): void {
    this.eventSubscriber = this.eventManager.subscribe('eventListModification', () => this.loadPage());
  }

  delete(event: IEvent): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IEvent[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/organisator/dashboard'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.events = data || [];
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
