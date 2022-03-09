import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICoupon, Coupon } from '../coupon.model';
import { CouponService } from '../service/coupon.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

@Component({
  selector: 'jhi-coupon-update',
  templateUrl: './coupon-update.component.html',
})
export class CouponUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    value: [],
    description: [],
    couponNr: [],
    used: [],
    user: [],
    event: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected couponService: CouponService,
    protected userService: UserService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ coupon }) => {
      this.updateForm(coupon);

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
    const coupon = this.createFromForm();
    if (coupon.id !== undefined) {
      this.subscribeToSaveResponse(this.couponService.update(coupon));
    } else {
      this.subscribeToSaveResponse(this.couponService.create(coupon));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICoupon>>): void {
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

  protected updateForm(coupon: ICoupon): void {
    this.editForm.patchValue({
      id: coupon.id,
      title: coupon.title,
      value: coupon.value,
      description: coupon.description,
      couponNr: coupon.couponNr,
      used: coupon.used,
      user: coupon.user,
      event: coupon.event,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, coupon.user);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, coupon.event);
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
  }

  protected createFromForm(): ICoupon {
    return {
      ...new Coupon(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      value: this.editForm.get(['value'])!.value,
      description: this.editForm.get(['description'])!.value,
      couponNr: this.editForm.get(['couponNr'])!.value,
      used: this.editForm.get(['used'])!.value,
      user: this.editForm.get(['user'])!.value,
      event: this.editForm.get(['event'])!.value,
    };
  }
}
