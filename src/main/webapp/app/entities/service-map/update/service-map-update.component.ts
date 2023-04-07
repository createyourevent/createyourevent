import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IServiceMap, ServiceMap } from '../service-map.model';
import { ServiceMapService } from '../service/service-map.service';
import { IRideCosts } from 'app/entities/ride-costs/ride-costs.model';
import { RideCostsService } from 'app/entities/ride-costs/service/ride-costs.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';

@Component({
  selector: 'jhi-service-map-update',
  templateUrl: './service-map-update.component.html',
})
export class ServiceMapUpdateComponent implements OnInit {
  isSaving = false;

  rideCostsCollection: IRideCosts[] = [];
  createYourEventServicesSharedCollection: ICreateYourEventService[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    rideCost: [],
    createYourEventService: [],
  });

  constructor(
    protected serviceMapService: ServiceMapService,
    protected rideCostsService: RideCostsService,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceMap }) => {
      this.updateForm(serviceMap);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceMap = this.createFromForm();
    if (serviceMap.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceMapService.update(serviceMap));
    } else {
      this.subscribeToSaveResponse(this.serviceMapService.create(serviceMap));
    }
  }

  trackRideCostsById(index: number, item: IRideCosts): number {
    return item.id!;
  }

  trackCreateYourEventServiceById(index: number, item: ICreateYourEventService): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceMap>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(serviceMap: IServiceMap): void {
    this.editForm.patchValue({
      id: serviceMap.id,
      title: serviceMap.title,
      rideCost: serviceMap.rideCost,
      createYourEventService: serviceMap.createYourEventService,
    });

    this.rideCostsCollection = this.rideCostsService.addRideCostsToCollectionIfMissing(this.rideCostsCollection, serviceMap.rideCost);
    this.createYourEventServicesSharedCollection = this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
      this.createYourEventServicesSharedCollection,
      serviceMap.createYourEventService
    );
  }

  protected loadRelationshipsOptions(): void {
    this.rideCostsService
      .query({ filter: 'servicemap-is-null' })
      .pipe(map((res: HttpResponse<IRideCosts[]>) => res.body ?? []))
      .pipe(
        map((rideCosts: IRideCosts[]) =>
          this.rideCostsService.addRideCostsToCollectionIfMissing(rideCosts, this.editForm.get('rideCost')!.value)
        )
      )
      .subscribe((rideCosts: IRideCosts[]) => (this.rideCostsCollection = rideCosts));

    this.createYourEventServiceService
      .query()
      .pipe(map((res: HttpResponse<ICreateYourEventService[]>) => res.body ?? []))
      .pipe(
        map((createYourEventServices: ICreateYourEventService[]) =>
          this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
            createYourEventServices,
            this.editForm.get('createYourEventService')!.value
          )
        )
      )
      .subscribe(
        (createYourEventServices: ICreateYourEventService[]) => (this.createYourEventServicesSharedCollection = createYourEventServices)
      );
  }

  protected createFromForm(): IServiceMap {
    return {
      ...new ServiceMap(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      rideCost: this.editForm.get(['rideCost'])!.value,
      createYourEventService: this.editForm.get(['createYourEventService'])!.value,
    };
  }
}
