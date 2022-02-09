import { Component, OnInit, OnDestroy } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { IRideCosts, RideCosts } from "app/entities/ride-costs/ride-costs.model";
import { RideCostsService } from "app/entities/ride-costs/service/ride-costs.service";
import { ServiceMap } from "app/entities/service-map/service-map.model";
import { ServiceMapService } from "app/entities/service-map/service/service-map.service";
import { ServiceOffer, IServiceOffer } from "app/entities/service-offer/service-offer.model";
import { ServiceOfferService } from "app/entities/service-offer/service/service-offer.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-service-offers',
  templateUrl: './service-offers.component.html',
  styleUrls: ['service-offers.component.scss']
})
export class ServiceOffersComponent implements OnInit, OnDestroy {
  serviceMapId = 0;
  serviceMap!: ServiceMap;
  serviceOffers: ServiceOffer[] = [];
  serviceId = 0;
  user!: IUser;
  productDialog = false;
  submitted!: boolean;
  total = 0;

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
    private rideCostsService: RideCostsService
  ) {}

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    this.serviceMapId = Number(this.route.snapshot.paramMap.get('serviceMapId'));
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;

      this.serviceMapService.find(this.serviceMapId).subscribe(smi => {
        this.serviceMap = smi.body!;
        if(this.serviceMap.rideCost === null) {
          const rc: IRideCosts = new RideCosts();
          rc.pricePerKilometre = 0;
          this.rideCostsService.create(rc).subscribe(res => {
            this.serviceMap.rideCost = res.body;
            this.serviceMapService.update(this.serviceMap).subscribe();
          });
        }
      });

      this.generalService.getAllServiceOffersByServiceMapId(this.serviceMapId).subscribe(res => {
        this.serviceOffers = res.body!;

        this.total = 0;
        this.serviceOffers.forEach(element => {
          this.total += element.costHour!;
        });
      });
    });
  }

  ngOnDestroy(): void {}

  openNew(): void {
    this.submitted = false;
    this.productDialog = true;
  }

  hideDialog(): void {
    this.productDialog = false;
    this.submitted = false;
  }

  /*
  changeServiceMap(event): void {
    this.total = 0;
    const value = event.target.value;
    if(Number(value) === 0) {
      this.serviceMap = undefined;
      return;
    }
    this.serviceMapId = Number(value);
    this.serviceMapService.find(this.serviceMapId).subscribe(res => {
      this.serviceMap = res.body;
      if(this.serviceMap.rideCost !== null) {
        this.rideCostsService.find(this.serviceMap.rideCost.id).subscribe(rc => {
          this.rideCosts = rc.body;
        })
      }
    });
    this.generalService.getAllServiceOffersByServiceMapId(this.serviceMapId).subscribe(res => {
      this.serviceOffers = res.body;

      this.total = 0;
      this.serviceOffers.forEach(element => {
        this.total += element.costHour;
      });
    });
  }
  */

  save(): void {
    this.submitted = true;
    const offer = this.saveOffer();
    this.serviceOfferService.create(offer).subscribe(res => {
      const offerNew = res.body!;
      this.serviceOffers.push(offerNew);
      this.generalService.getAllServiceOffersByServiceMapId(this.serviceMapId).subscribe(resu => {
        this.serviceOffers = resu.body!;

        this.total = 0;
        this.serviceOffers.forEach(element => {
          this.total += element.costHour!;
        });
        this.editForm.reset();
        this.hideDialog();
        this.submitted = false;
      });
    });
  }

  saveOffer(): IServiceOffer {
    return {
      ...new ServiceOffer(),
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      costHour: this.editForm.get(['costHour'])!.value,
      serviceMaps: this.serviceMap
    };
  }

  onRowEditInit(serviceoffer: ServiceOffer): void {}

  onRowEditSave(serviceoffer: ServiceOffer): void {
    this.serviceOfferService.update(serviceoffer).subscribe();
  }

  onRowEditCancel(serviceoffer: ServiceOffer, index: number): void {
    this.serviceOffers.splice(index, 1);
    this.serviceOfferService.delete(serviceoffer.id!).subscribe();
  }

  gotoNewServiceMaps(): void {
    this.router.navigate(['/service/service-maps/new/' + this.serviceId]);
  }

  addRideCosts(): void {
    this.router.navigate(['/service/service-maps/addRideCosts/' + this.serviceId + '/' + this.serviceMapId]);
  }

  previousState(): void {
    window.history.back();
  }

  gotoServiceMaps(): void {
    this.router.navigate(['/service/service-maps/' + this.serviceId]);
  }

}
