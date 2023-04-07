import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAdminFeesPrice, AdminFeesPrice } from '../admin-fees-price.model';
import { AdminFeesPriceService } from '../service/admin-fees-price.service';

@Component({
  selector: 'jhi-admin-fees-price-update',
  templateUrl: './admin-fees-price-update.component.html',
})
export class AdminFeesPriceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    feesOrganisator: [],
    feesSupplier: [],
    feesService: [],
    feesOrganizations: [],
  });

  constructor(
    protected adminFeesPriceService: AdminFeesPriceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adminFeesPrice }) => {
      this.updateForm(adminFeesPrice);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const adminFeesPrice = this.createFromForm();
    if (adminFeesPrice.id !== undefined) {
      this.subscribeToSaveResponse(this.adminFeesPriceService.update(adminFeesPrice));
    } else {
      this.subscribeToSaveResponse(this.adminFeesPriceService.create(adminFeesPrice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdminFeesPrice>>): void {
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

  protected updateForm(adminFeesPrice: IAdminFeesPrice): void {
    this.editForm.patchValue({
      id: adminFeesPrice.id,
      feesOrganisator: adminFeesPrice.feesOrganisator,
      feesSupplier: adminFeesPrice.feesSupplier,
      feesService: adminFeesPrice.feesService,
      feesOrganizations: adminFeesPrice.feesOrganizations,
    });
  }

  protected createFromForm(): IAdminFeesPrice {
    return {
      ...new AdminFeesPrice(),
      id: this.editForm.get(['id'])!.value,
      feesOrganisator: this.editForm.get(['feesOrganisator'])!.value,
      feesSupplier: this.editForm.get(['feesSupplier'])!.value,
      feesService: this.editForm.get(['feesService'])!.value,
      feesOrganizations: this.editForm.get(['feesOrganizations'])!.value,
    };
  }
}
