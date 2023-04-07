import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISlotListOrange, SlotListOrange } from '../slot-list-orange.model';
import { SlotListOrangeService } from '../service/slot-list-orange.service';

@Component({
  selector: 'jhi-slot-list-orange-update',
  templateUrl: './slot-list-orange-update.component.html',
})
export class SlotListOrangeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    coupons: [],
  });

  constructor(
    protected slotListOrangeService: SlotListOrangeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slotListOrange }) => {
      this.updateForm(slotListOrange);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const slotListOrange = this.createFromForm();
    if (slotListOrange.id !== undefined) {
      this.subscribeToSaveResponse(this.slotListOrangeService.update(slotListOrange));
    } else {
      this.subscribeToSaveResponse(this.slotListOrangeService.create(slotListOrange));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISlotListOrange>>): void {
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

  protected updateForm(slotListOrange: ISlotListOrange): void {
    this.editForm.patchValue({
      id: slotListOrange.id,
      coupons: slotListOrange.coupons,
    });
  }

  protected createFromForm(): ISlotListOrange {
    return {
      ...new SlotListOrange(),
      id: this.editForm.get(['id'])!.value,
      coupons: this.editForm.get(['coupons'])!.value,
    };
  }
}
