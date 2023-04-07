import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFeeBalance, FeeBalance } from '../fee-balance.model';
import { FeeBalanceService } from '../service/fee-balance.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { FeeType } from 'app/entities/enumerations/fee-type.model';

@Component({
  selector: 'jhi-fee-balance-update',
  templateUrl: './fee-balance-update.component.html',
})
export class FeeBalanceUpdateComponent implements OnInit {
  isSaving = false;
  feeTypeValues = Object.keys(FeeType);

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    type: [],
    total: [],
    user: [],
  });

  constructor(
    protected feeBalanceService: FeeBalanceService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeBalance }) => {
      if (feeBalance.id === undefined) {
        const today = dayjs().startOf('day');
        feeBalance.date = today;
      }

      this.updateForm(feeBalance);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const feeBalance = this.createFromForm();
    if (feeBalance.id !== undefined) {
      this.subscribeToSaveResponse(this.feeBalanceService.update(feeBalance));
    } else {
      this.subscribeToSaveResponse(this.feeBalanceService.create(feeBalance));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFeeBalance>>): void {
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

  protected updateForm(feeBalance: IFeeBalance): void {
    this.editForm.patchValue({
      id: feeBalance.id,
      date: feeBalance.date ? feeBalance.date.format(DATE_TIME_FORMAT) : null,
      type: feeBalance.type,
      total: feeBalance.total,
      user: feeBalance.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, feeBalance.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFeeBalance {
    return {
      ...new FeeBalance(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      type: this.editForm.get(['type'])!.value,
      total: this.editForm.get(['total'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
