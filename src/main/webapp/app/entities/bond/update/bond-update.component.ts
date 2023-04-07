import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBond, Bond } from '../bond.model';
import { BondService } from '../service/bond.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPointsExchange } from 'app/entities/points-exchange/points-exchange.model';
import { PointsExchangeService } from 'app/entities/points-exchange/service/points-exchange.service';

@Component({
  selector: 'jhi-bond-update',
  templateUrl: './bond-update.component.html',
})
export class BondUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  pointsExchangesSharedCollection: IPointsExchange[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    code: [],
    points: [],
    creationDate: [],
    redemptionDate: [],
    user: [],
    pointsExchange: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected bondService: BondService,
    protected userService: UserService,
    protected pointsExchangeService: PointsExchangeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bond }) => {
      if (bond.id === undefined) {
        const today = dayjs().startOf('day');
        bond.creationDate = today;
        bond.redemptionDate = today;
      }

      this.updateForm(bond);

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
    const bond = this.createFromForm();
    if (bond.id !== undefined) {
      this.subscribeToSaveResponse(this.bondService.update(bond));
    } else {
      this.subscribeToSaveResponse(this.bondService.create(bond));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackPointsExchangeById(index: number, item: IPointsExchange): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBond>>): void {
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

  protected updateForm(bond: IBond): void {
    this.editForm.patchValue({
      id: bond.id,
      name: bond.name,
      description: bond.description,
      code: bond.code,
      points: bond.points,
      creationDate: bond.creationDate ? bond.creationDate.format(DATE_TIME_FORMAT) : null,
      redemptionDate: bond.redemptionDate ? bond.redemptionDate.format(DATE_TIME_FORMAT) : null,
      user: bond.user,
      pointsExchange: bond.pointsExchange,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, bond.user);
    this.pointsExchangesSharedCollection = this.pointsExchangeService.addPointsExchangeToCollectionIfMissing(
      this.pointsExchangesSharedCollection,
      bond.pointsExchange
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.pointsExchangeService
      .query()
      .pipe(map((res: HttpResponse<IPointsExchange[]>) => res.body ?? []))
      .pipe(
        map((pointsExchanges: IPointsExchange[]) =>
          this.pointsExchangeService.addPointsExchangeToCollectionIfMissing(pointsExchanges, this.editForm.get('pointsExchange')!.value)
        )
      )
      .subscribe((pointsExchanges: IPointsExchange[]) => (this.pointsExchangesSharedCollection = pointsExchanges));
  }

  protected createFromForm(): IBond {
    return {
      ...new Bond(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      code: this.editForm.get(['code'])!.value,
      points: this.editForm.get(['points'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      redemptionDate: this.editForm.get(['redemptionDate'])!.value
        ? dayjs(this.editForm.get(['redemptionDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      user: this.editForm.get(['user'])!.value,
      pointsExchange: this.editForm.get(['pointsExchange'])!.value,
    };
  }
}
