import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISlotListPlum, SlotListPlum } from '../slot-list-plum.model';
import { SlotListPlumService } from '../service/slot-list-plum.service';

@Component({
  selector: 'jhi-slot-list-plum-update',
  templateUrl: './slot-list-plum-update.component.html',
})
export class SlotListPlumUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    coupons: [],
  });

  constructor(protected slotListPlumService: SlotListPlumService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListPlum }) => {
      this.updateForm(slotListPlum);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const slotListPlum = this.createFromForm();
    if (slotListPlum.id !== undefined) {
      this.subscribeToSaveResponse(this.slotListPlumService.update(slotListPlum));
    } else {
      this.subscribeToSaveResponse(this.slotListPlumService.create(slotListPlum));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISlotListPlum>>): void {
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

  protected updateForm(slotListPlum: ISlotListPlum): void {
    this.editForm.patchValue({
      id: slotListPlum.id,
      coupons: slotListPlum.coupons,
    });
  }

  protected createFromForm(): ISlotListPlum {
    return {
      ...new SlotListPlum(),
      id: this.editForm.get(['id'])!.value,
      coupons: this.editForm.get(['coupons'])!.value,
    };
  }
}
