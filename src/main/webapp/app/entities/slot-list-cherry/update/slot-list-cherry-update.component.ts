import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISlotListCherry, SlotListCherry } from '../slot-list-cherry.model';
import { SlotListCherryService } from '../service/slot-list-cherry.service';

@Component({
  selector: 'jhi-slot-list-cherry-update',
  templateUrl: './slot-list-cherry-update.component.html',
})
export class SlotListCherryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    coupons: [],
  });

  constructor(
    protected slotListCherryService: SlotListCherryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListCherry }) => {
      this.updateForm(slotListCherry);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const slotListCherry = this.createFromForm();
    if (slotListCherry.id !== undefined) {
      this.subscribeToSaveResponse(this.slotListCherryService.update(slotListCherry));
    } else {
      this.subscribeToSaveResponse(this.slotListCherryService.create(slotListCherry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISlotListCherry>>): void {
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

  protected updateForm(slotListCherry: ISlotListCherry): void {
    this.editForm.patchValue({
      id: slotListCherry.id,
      coupons: slotListCherry.coupons,
    });
  }

  protected createFromForm(): ISlotListCherry {
    return {
      ...new SlotListCherry(),
      id: this.editForm.get(['id'])!.value,
      coupons: this.editForm.get(['coupons'])!.value,
    };
  }
}
