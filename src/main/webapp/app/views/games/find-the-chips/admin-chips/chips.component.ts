import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { IChipsAdmin } from "app/entities/chips-admin/chips-admin.model";
import { ChipsAdminService } from "app/entities/chips-admin/service/chips-admin.service";
import { ChipsCollectionService } from "app/entities/chips-collection/service/chips-collection.service";
import { IChips } from "app/entities/chips/chips.model";
import { ChipsService } from "app/entities/chips/service/chips.service";
import { PropertyService } from "app/entities/property/service/property.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { JhiDataUtils, JhiEventManager } from "ng-jhipster";
import { ConfirmationService, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SwitchOffOnEmitterService } from "../switch-off-on-emitter.service";
import { ChipsDeleteDialogComponent } from "./chips-delete-dialog.component";


@Component({
  selector: 'jhi-admin-chips',
  templateUrl: './chips.component.html',
  providers: [ConfirmationService,MessageService]
})
export class ChipsComponent implements OnInit, OnDestroy {

  switched = false;
  chips?: IChips[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  stateOptions: any[];
  value1 = "off";

  color: string = '';

  usersWithAllChips: IUser[] = [];


  constructor(
    protected chipsService: ChipsService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private switchOffOnEmitterService: SwitchOffOnEmitterService,
    private chipsAdminService: ChipsAdminService,
    private generalService: GeneralService,
    private chipsCollectionService: ChipsCollectionService,
    private propertyService: PropertyService
  ) {
    this.stateOptions = [{label: 'Off', value: 'off'}, {label: 'On', value: 'on'}];
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;

    this.chipsService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IChips[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError()
      );
  }

  changeColor(e: any): void {
    this.generalService.findPropertyByKey('color_chips').subscribe(cp => {
      const property = cp.body!;
      property.value  = e.value;
      this.propertyService.update(property).subscribe();
    });

  }


  ngOnInit(): void {
    this.generalService.findPropertyByKey('color_chips').subscribe(cp => {
      this.color = cp.body!.value!;
    });

    this.chipsAdminService.find(1).subscribe(active => {
      const activeGame = active.body!.gameActive;
      if(activeGame) {
        this.value1 = "on";
      }
    });

    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadPage();
      this.getAllUsersWithAllChips();
    });
    this.registerChangeInChips();
  }

  getAllUsersWithAllChips(): void {
    if(this.value1 === "off") {
      this.usersWithAllChips = [];
    } else {
      const countChips = this.chips!.length;


      this.chipsCollectionService.query().subscribe(cc => {
        const chipCollections = cc.body!;

        chipCollections.forEach(col => {
          this.generalService.findAllChipsCollectionChipsByChipsCollectionId(col.id!).subscribe(c => {
            if(c.body!.length === this.chips!.length) {
              this.usersWithAllChips.push(col.user!);
            }
          });
        });
      });
    }
  }

  switchOnOff(e: any): void {
    this.chipsAdminService.find(1).subscribe(a => {
      const activeGame: IChipsAdmin = a.body!;
      if(e.value === 'off') {
        activeGame.gameActive = false;
        this.deleteAllChipsRelations();
        this.getAllUsersWithAllChips();
      } else {
        activeGame.gameActive = true;
      }
      this.chipsAdminService.update(activeGame).subscribe(ua => {
        this.switchOffOnEmitterService.onSwitchOffOnButtonClick(e.value);
      });
    });

  }

  deleteAllChipsRelations(): void {
    this.generalService.deleteAllChipsCollectionChips().subscribe();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IChips): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInChips(): void {
    this.eventSubscriber = this.eventManager.subscribe('chipsListModification', () => this.loadPage());
  }

  delete(chips: IChips): void {
    const modalRef = this.modalService.open(ChipsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chips = chips;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IChips[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/adminChips'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.chips = data || [];
      this.getAllUsersWithAllChips();
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
