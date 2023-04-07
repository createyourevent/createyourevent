import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICreateYourEventService, CreateYourEventService } from '../create-your-event-service.model';
import { CreateYourEventServiceService } from '../service/create-your-event-service.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ServiceCategory } from 'app/entities/enumerations/service-category.model';

@Component({
  selector: 'jhi-create-your-event-service-update',
  templateUrl: './create-your-event-service-update.component.html',
})
export class CreateYourEventServiceUpdateComponent implements OnInit {
  isSaving = false;
  serviceCategoryValues = Object.keys(ServiceCategory);

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    logo: [],
    logoContentType: [],
    active: [],
    activeOwner: [],
    description: [null, [Validators.required]],
    address: [null, [Validators.required]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [],
    category: [null, [Validators.required]],
    user: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ createYourEventService }) => {
      this.updateForm(createYourEventService);

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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const createYourEventService = this.createFromForm();
    if (createYourEventService.id !== undefined) {
      this.subscribeToSaveResponse(this.createYourEventServiceService.update(createYourEventService));
    } else {
      this.subscribeToSaveResponse(this.createYourEventServiceService.create(createYourEventService));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreateYourEventService>>): void {
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

  protected updateForm(createYourEventService: ICreateYourEventService): void {
    this.editForm.patchValue({
      id: createYourEventService.id,
      name: createYourEventService.name,
      logo: createYourEventService.logo,
      logoContentType: createYourEventService.logoContentType,
      active: createYourEventService.active,
      activeOwner: createYourEventService.activeOwner,
      description: createYourEventService.description,
      address: createYourEventService.address,
      motto: createYourEventService.motto,
      phone: createYourEventService.phone,
      webAddress: createYourEventService.webAddress,
      category: createYourEventService.category,
      user: createYourEventService.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, createYourEventService.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ICreateYourEventService {
    return {
      ...new CreateYourEventService(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      active: this.editForm.get(['active'])!.value,
      activeOwner: this.editForm.get(['activeOwner'])!.value,
      description: this.editForm.get(['description'])!.value,
      address: this.editForm.get(['address'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      webAddress: this.editForm.get(['webAddress'])!.value,
      category: this.editForm.get(['category'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
