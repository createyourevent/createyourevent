import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHotel, Hotel } from '../hotel.model';
import { HotelService } from '../service/hotel.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-hotel-update',
  templateUrl: './hotel-update.component.html',
})
export class HotelUpdateComponent implements OnInit {
  isSaving = false;

  organizationsCollection: IOrganization[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    menu: [],
    placesToSleep: [],
    organization: [],
    user: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected hotelService: HotelService,
    protected organizationService: OrganizationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hotel }) => {
      this.updateForm(hotel);

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
    const hotel = this.createFromForm();
    if (hotel.id !== undefined) {
      this.subscribeToSaveResponse(this.hotelService.update(hotel));
    } else {
      this.subscribeToSaveResponse(this.hotelService.create(hotel));
    }
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHotel>>): void {
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

  protected updateForm(hotel: IHotel): void {
    this.editForm.patchValue({
      id: hotel.id,
      menu: hotel.menu,
      placesToSleep: hotel.placesToSleep,
      organization: hotel.organization,
      user: hotel.user,
    });

    this.organizationsCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsCollection,
      hotel.organization
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, hotel.user);
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query({ filter: 'hotel-is-null' })
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(organizations, this.editForm.get('organization')!.value)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsCollection = organizations));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IHotel {
    return {
      ...new Hotel(),
      id: this.editForm.get(['id'])!.value,
      menu: this.editForm.get(['menu'])!.value,
      placesToSleep: this.editForm.get(['placesToSleep'])!.value,
      organization: this.editForm.get(['organization'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
