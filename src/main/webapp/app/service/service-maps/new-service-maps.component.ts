import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ICreateYourEventService } from "app/entities/create-your-event-service/create-your-event-service.model";
import { CreateYourEventServiceService } from "app/entities/create-your-event-service/service/create-your-event-service.service";
import { IServiceMap, ServiceMap } from "app/entities/service-map/service-map.model";
import { ServiceMapService } from "app/entities/service-map/service/service-map.service";
import { Observable } from "rxjs";


@Component({
  selector: 'jhi-new-service-maps',
  templateUrl: './new-service-maps.component.html',
  styleUrls: ['new-service-maps.component.scss']
})
export class NewServiceMapsComponent implements OnInit {

  isSaving = false;
  createyoureventservices: ICreateYourEventService[] = [];
  serviceId!: number;
  service!: ICreateYourEventService;
  serviceMapId!: number;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    createYourEventService: []
  });

  constructor(
    protected serviceMapService: ServiceMapService,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    this.createYourEventServiceService.find(this.serviceId).subscribe(res => {
      this.service = res.body!;
    });
  }


  previousState(): void {
    this.router.navigate(['/service/dashboard']);
  }

  save(): void {
    this.isSaving = true;
    const serviceMap = this.createFromForm();
    this.subscribeToSaveResponse(this.serviceMapService.create(serviceMap));
  }

  private createFromForm(): IServiceMap {
    return {
      ...new ServiceMap(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      createYourEventService: this.service
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceMap>>): void {
    result.subscribe(res => {
      this.onSaveSuccess(res.body!),
      () => this.onSaveError()
    }
    );
  }

  protected onSaveSuccess(sm: IServiceMap): void {
    this.editForm.reset();
    this.isSaving = false;
    this.router.navigate(['/service/service-maps/service-offers/' + this.serviceId + '/' + sm.id]);
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: ICreateYourEventService): any {
    return item.id;
  }

}
