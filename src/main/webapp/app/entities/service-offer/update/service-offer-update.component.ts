import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IServiceOffer, ServiceOffer } from '../service-offer.model';
import { ServiceOfferService } from '../service/service-offer.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ServiceMapService } from 'app/entities/service-map/service/service-map.service';

@Component({
  selector: 'jhi-service-offer-update',
  templateUrl: './service-offer-update.component.html',
})
export class ServiceOfferUpdateComponent implements OnInit {
  isSaving = false;

  serviceMapsSharedCollection: IServiceMap[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    costHour: [null, [Validators.required]],
    serviceMaps: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected serviceOfferService: ServiceOfferService,
    protected serviceMapService: ServiceMapService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceOffer }) => {
      this.updateForm(serviceOffer);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('createyoureventApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceOffer = this.createFromForm();
    if (serviceOffer.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceOfferService.update(serviceOffer));
    } else {
      this.subscribeToSaveResponse(this.serviceOfferService.create(serviceOffer));
    }
  }

  trackServiceMapById(index: number, item: IServiceMap): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceOffer>>): void {
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

  protected updateForm(serviceOffer: IServiceOffer): void {
    this.editForm.patchValue({
      id: serviceOffer.id,
      title: serviceOffer.title,
      description: serviceOffer.description,
      costHour: serviceOffer.costHour,
      serviceMaps: serviceOffer.serviceMaps,
    });

    this.serviceMapsSharedCollection = this.serviceMapService.addServiceMapToCollectionIfMissing(
      this.serviceMapsSharedCollection,
      serviceOffer.serviceMaps
    );
  }

  protected loadRelationshipsOptions(): void {
    this.serviceMapService
      .query()
      .pipe(map((res: HttpResponse<IServiceMap[]>) => res.body ?? []))
      .pipe(
        map((serviceMaps: IServiceMap[]) =>
          this.serviceMapService.addServiceMapToCollectionIfMissing(serviceMaps, this.editForm.get('serviceMaps')!.value)
        )
      )
      .subscribe((serviceMaps: IServiceMap[]) => (this.serviceMapsSharedCollection = serviceMaps));
  }

  protected createFromForm(): IServiceOffer {
    return {
      ...new ServiceOffer(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      costHour: this.editForm.get(['costHour'])!.value,
      serviceMaps: this.editForm.get(['serviceMaps'])!.value,
    };
  }
}
