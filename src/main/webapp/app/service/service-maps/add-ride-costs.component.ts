import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IRideCosts, RideCosts } from "app/entities/ride-costs/ride-costs.model";
import { RideCostsService } from "app/entities/ride-costs/service/ride-costs.service";
import { ServiceMap } from "app/entities/service-map/service-map.model";
import { ServiceMapService } from "app/entities/service-map/service/service-map.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { Observable } from "rxjs";



@Component({
  selector: 'jhi-add-ride-costs',
  templateUrl: './add-ride-costs.component.html'
})
export class AddRideCostsComponent implements OnInit {

  isSaving = false;
  serviceMapId!: number;
  user!: IUser;
  serviceMap!: ServiceMap;
  serviceId!: number;

  editForm = this.fb.group({
    id: [],
    pricePerKilometre: [null, [Validators.required]]
  });

  constructor(protected rideCostsService: RideCostsService,
              protected activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private generalService: GeneralService,
              private serviceMapService: ServiceMapService,
              private router: Router) {}

  ngOnInit(): void {
    this.serviceMapId = Number(this.route.snapshot.paramMap.get('serviceMapId'));
    this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!

      this.serviceMapService.find(this.serviceMapId).subscribe(res => {
        this.serviceMap = res.body!;
        this.updateForm(this.serviceMap.rideCost!);
      });
    });

  }

  updateForm(rideCosts: IRideCosts): void {
    this.editForm.patchValue({
      id: rideCosts.id,
      pricePerKilometre: rideCosts.pricePerKilometre
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rideCosts = this.createFromForm();
    if (rideCosts.id !== null) {
      this.subscribeToSaveResponse(this.rideCostsService.update(rideCosts));
    } else {
      this.rideCostsService.create(rideCosts).subscribe(res => {
        this.serviceMap.rideCost = res.body;
        this.serviceMapService.update(this.serviceMap).subscribe(() => {
          this.router.navigate(['/service/service-maps/service-offers/' + this.serviceId + '/' + this.serviceMapId]);
          this.isSaving = false;
        });

      });
    }

  }

  private createFromForm(): IRideCosts {
    return {
      ...new RideCosts(),
      id: this.editForm.get(['id'])!.value,
      pricePerKilometre: this.editForm.get(['pricePerKilometre'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRideCosts>>): void {
    result.subscribe(() => {
      this.router.navigate(['/service/service-maps/service-offers/' + this.serviceId + '/' + this.serviceMapId]);
    });
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

}
