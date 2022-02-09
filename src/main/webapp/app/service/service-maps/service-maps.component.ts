import { Component, OnInit, OnDestroy } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IRideCosts } from "app/entities/ride-costs/ride-costs.model";
import { RideCostsService } from "app/entities/ride-costs/service/ride-costs.service";
import { ServiceMapDeleteDialogComponent } from "app/entities/service-map/delete/service-map-delete-dialog.component";
import { ServiceMap, IServiceMap } from "app/entities/service-map/service-map.model";
import { ServiceMapService } from "app/entities/service-map/service/service-map.service";
import { ServiceOfferService } from "app/entities/service-offer/service/service-offer.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { JhiEventManager } from "ng-jhipster";
import { Subscription } from "rxjs";


@Component({
  selector: 'jhi-service-maps',
  templateUrl: './service-maps.component.html',
  styleUrls: ['service-maps.component.scss']
})
export class ServiceMapsComponent implements OnInit, OnDestroy {
  serviceMaps!: ServiceMap[];
  serviceMapId = 0;
  serviceMap!: ServiceMap;
  serviceId!: number;
  user!: IUser;
  productDialog = false;
  submitted!: boolean;
  total = 0;
  rideCosts!: IRideCosts;
  eventSubscriber?: Subscription;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    costHour: [null, [Validators.required]],
    serviceMaps: []
  });

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private fb: FormBuilder,
    private serviceOfferService: ServiceOfferService,
    private serviceMapService: ServiceMapService,
    private rideCostsService: RideCostsService,
    protected modalService: NgbModal,
    protected eventManager: JhiEventManager
  ) {}

  ngOnInit(): void {
    this.eventSubscriber = this.eventManager.subscribe('serviceMapListModification', () => this.loadPage());
    this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    this.loadPage();
  }

  loadPage(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;

      this.generalService.findByCreateYourEventServiceId(this.serviceId).subscribe(res => {
        this.serviceMaps = res.body!;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  onRowEditInit(servicemap: ServiceMap): void {}

  onRowEditSave(servicemap: ServiceMap): void {
    this.serviceMapService.update(servicemap).subscribe();
  }

  onRowEditCancel(servicemap: ServiceMap, index: number): void {
    this.serviceMaps.splice(index, 1);
    this.serviceMapService.delete(servicemap.id!).subscribe();
  }

  gotoNewServiceMaps(): void {
    this.router.navigate(['/service/service-maps/new/' + this.serviceId]);
  }

  gotoServiceOffers(serviceMapId: number): void {
    this.router.navigate(['/service/service-maps/service-offers/' + this.serviceId + '/' + serviceMapId]);
  }

  previousState(): void {
    window.history.back();
  }

  delete(serviceMap: IServiceMap): void {
    const modalRef = this.modalService.open(ServiceMapDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.serviceMap = serviceMap;
    modalRef.result.then((data) => {
      this.loadPage();
    }, (reason) => {

    });
  }

  gotoDashboard(): void {
    this.router.navigate(['/service/dashboard']);
  }
}
