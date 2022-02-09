import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganizationReservation, OrganizationReservation } from '../organization-reservation.model';
import { OrganizationReservationService } from '../service/organization-reservation.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

@Component({
  selector: 'jhi-organization-reservation-update',
  templateUrl: './organization-reservation-update.component.html',
})
export class OrganizationReservationUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  eventsSharedCollection: IEvent[] = [];
  organizationsSharedCollection: IOrganization[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    dateFrom: [],
    dateUntil: [],
    seen: [],
    approved: [],
    total: [],
    feeBilled: [],
    user: [],
    event: [],
    organization: [],
  });

  constructor(
    protected organizationReservationService: OrganizationReservationService,
    protected userService: UserService,
    protected eventService: EventService,
    protected organizationService: OrganizationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationReservation }) => {
      if (organizationReservation.id === undefined) {
        const today = dayjs().startOf('day');
        organizationReservation.date = today;
        organizationReservation.dateFrom = today;
        organizationReservation.dateUntil = today;
      }

      this.updateForm(organizationReservation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizationReservation = this.createFromForm();
    if (organizationReservation.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationReservationService.update(organizationReservation));
    } else {
      this.subscribeToSaveResponse(this.organizationReservationService.create(organizationReservation));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizationReservation>>): void {
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

  protected updateForm(organizationReservation: IOrganizationReservation): void {
    this.editForm.patchValue({
      id: organizationReservation.id,
      date: organizationReservation.date ? organizationReservation.date.format(DATE_TIME_FORMAT) : null,
      dateFrom: organizationReservation.dateFrom ? organizationReservation.dateFrom.format(DATE_TIME_FORMAT) : null,
      dateUntil: organizationReservation.dateUntil ? organizationReservation.dateUntil.format(DATE_TIME_FORMAT) : null,
      seen: organizationReservation.seen,
      approved: organizationReservation.approved,
      total: organizationReservation.total,
      feeBilled: organizationReservation.feeBilled,
      user: organizationReservation.user,
      event: organizationReservation.event,
      organization: organizationReservation.organization,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, organizationReservation.user);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(
      this.eventsSharedCollection,
      organizationReservation.event
    );
    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsSharedCollection,
      organizationReservation.organization
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(organizations, this.editForm.get('organization')!.value)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));
  }

  protected createFromForm(): IOrganizationReservation {
    return {
      ...new OrganizationReservation(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      dateFrom: this.editForm.get(['dateFrom'])!.value ? dayjs(this.editForm.get(['dateFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUntil: this.editForm.get(['dateUntil'])!.value ? dayjs(this.editForm.get(['dateUntil'])!.value, DATE_TIME_FORMAT) : undefined,
      seen: this.editForm.get(['seen'])!.value,
      approved: this.editForm.get(['approved'])!.value,
      total: this.editForm.get(['total'])!.value,
      feeBilled: this.editForm.get(['feeBilled'])!.value,
      user: this.editForm.get(['user'])!.value,
      event: this.editForm.get(['event'])!.value,
      organization: this.editForm.get(['organization'])!.value,
    };
  }
}
