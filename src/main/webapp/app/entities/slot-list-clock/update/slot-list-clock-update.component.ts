import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISlotListClock, SlotListClock } from '../slot-list-clock.model';
import { SlotListClockService } from '../service/slot-list-clock.service';

@Component({
  selector: 'jhi-slot-list-clock-update',
  templateUrl: './slot-list-clock-update.component.html',
})
export class SlotListClockUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    coupons: [],
  });

  constructor(
    protected slotListClockService: SlotListClockService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListClock }) => {
      this.updateForm(slotListClock);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const slotListClock = this.createFromForm();
    if (slotListClock.id !== undefined) {
      this.subscribeToSaveResponse(this.slotListClockService.update(slotListClock));
    } else {
      this.subscribeToSaveResponse(this.slotListClockService.create(slotListClock));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISlotListClock>>): void {
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

  protected updateForm(slotListClock: ISlotListClock): void {
    this.editForm.patchValue({
      id: slotListClock.id,
      coupons: slotListClock.coupons,
    });
  }

  protected createFromForm(): ISlotListClock {
    return {
      ...new SlotListClock(),
      id: this.editForm.get(['id'])!.value,
      coupons: this.editForm.get(['coupons'])!.value,
    };
  }
}
