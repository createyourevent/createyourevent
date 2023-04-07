import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEvent, Event as Party } from '../event.model';
import { EventService } from '../service/event.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IEventDetails } from 'app/entities/event-details/event-details.model';
import { EventDetailsService } from 'app/entities/event-details/service/event-details.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { EventCategory } from 'app/entities/enumerations/event-category.model';
import { EventStatus } from 'app/entities/enumerations/event-status.model';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  eventCategoryValues = Object.keys(EventCategory);
  eventStatusValues = Object.keys(EventStatus);

  locationsCollection: ILocation[] = [];
  eventDetailsCollection: IEventDetails[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
    dateStart: [null, [Validators.required]],
    dateEnd: [null, [Validators.required]],
    category: [null, [Validators.required]],
    price: [null, [Validators.required]],
    flyer: [],
    flyerContentType: [],
    youtube: [],
    privateOrPublic: [null, [Validators.required]],
    active: [],
    minPlacenumber: [null, [Validators.required]],
    placenumber: [null, [Validators.required]],
    investment: [null, [Validators.required]],
    status: [],
    definitelyConfirmed: [],
    motto: [null, [Validators.required]],
    billed: [],
    stars: [],
    billedOrganisator: [],
    billedeCreateYourEvent: [],
    location: [],
    eventDetail: [],
    user: [],
    reservedUsers: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected eventService: EventService,
    protected locationService: LocationService,
    protected eventDetailsService: EventDetailsService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      if (event.id === undefined) {
        const today = dayjs().startOf('day');
        event.dateStart = today;
        event.dateEnd = today;
      }

      this.updateForm(event);

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
    const event = this.createFromForm();
    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  trackLocationById(index: number, item: ILocation): number {
    return item.id!;
  }

  trackEventDetailsById(index: number, item: IEventDetails): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  getSelectedUser(option: IUser, selectedVals?: IUser[]): IUser {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
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

  protected updateForm(event: IEvent): void {
    this.editForm.patchValue({
      id: event.id,
      name: event.name,
      description: event.description,
      dateStart: event.dateStart ? event.dateStart.format(DATE_TIME_FORMAT) : null,
      dateEnd: event.dateEnd ? event.dateEnd.format(DATE_TIME_FORMAT) : null,
      category: event.category,
      price: event.price,
      flyer: event.flyer,
      flyerContentType: event.flyerContentType,
      youtube: event.youtube,
      privateOrPublic: event.privateOrPublic,
      active: event.active,
      minPlacenumber: event.minPlacenumber,
      placenumber: event.placenumber,
      investment: event.investment,
      status: event.status,
      definitelyConfirmed: event.definitelyConfirmed,
      motto: event.motto,
      billed: event.billed,
      stars: event.stars,
      billedOrganisator: event.billedOrganisator,
      billedeCreateYourEvent: event.billedeCreateYourEvent,
      location: event.location,
      eventDetail: event.eventDetail,
      user: event.user,
      reservedUsers: event.reservedUsers,
    });

    this.locationsCollection = this.locationService.addLocationToCollectionIfMissing(this.locationsCollection, event.location);
    this.eventDetailsCollection = this.eventDetailsService.addEventDetailsToCollectionIfMissing(
      this.eventDetailsCollection,
      event.eventDetail
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      event.user,
      ...(event.reservedUsers ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'event-is-null' })
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsCollection = locations));

    this.eventDetailsService
      .query({ filter: 'event-is-null' })
      .pipe(map((res: HttpResponse<IEventDetails[]>) => res.body ?? []))
      .pipe(
        map((eventDetails: IEventDetails[]) =>
          this.eventDetailsService.addEventDetailsToCollectionIfMissing(eventDetails, this.editForm.get('eventDetail')!.value)
        )
      )
      .subscribe((eventDetails: IEventDetails[]) => (this.eventDetailsCollection = eventDetails));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(
            users,
            this.editForm.get('user')!.value,
            ...(this.editForm.get('reservedUsers')!.value ?? [])
          )
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IEvent {
    return {
      ...new Party(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateStart: this.editForm.get(['dateStart'])!.value ? dayjs(this.editForm.get(['dateStart'])!.value, DATE_TIME_FORMAT) : undefined,
      dateEnd: this.editForm.get(['dateEnd'])!.value ? dayjs(this.editForm.get(['dateEnd'])!.value, DATE_TIME_FORMAT) : undefined,
      category: this.editForm.get(['category'])!.value,
      price: this.editForm.get(['price'])!.value,
      flyerContentType: this.editForm.get(['flyerContentType'])!.value,
      flyer: this.editForm.get(['flyer'])!.value,
      youtube: this.editForm.get(['youtube'])!.value,
      privateOrPublic: this.editForm.get(['privateOrPublic'])!.value,
      active: this.editForm.get(['active'])!.value,
      minPlacenumber: this.editForm.get(['minPlacenumber'])!.value,
      placenumber: this.editForm.get(['placenumber'])!.value,
      investment: this.editForm.get(['investment'])!.value,
      status: this.editForm.get(['status'])!.value,
      definitelyConfirmed: this.editForm.get(['definitelyConfirmed'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      billed: this.editForm.get(['billed'])!.value,
      stars: this.editForm.get(['stars'])!.value,
      billedOrganisator: this.editForm.get(['billedOrganisator'])!.value,
      billedeCreateYourEvent: this.editForm.get(['billedeCreateYourEvent'])!.value,
      location: this.editForm.get(['location'])!.value,
      eventDetail: this.editForm.get(['eventDetail'])!.value,
      user: this.editForm.get(['user'])!.value,
      reservedUsers: this.editForm.get(['reservedUsers'])!.value,
    };
  }
}
