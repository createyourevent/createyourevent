import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDeliveryType, DeliveryType } from '../delivery-type.model';
import { DeliveryTypeService } from '../service/delivery-type.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { DeliveryTypes } from 'app/entities/enumerations/delivery-types.model';

@Component({
  selector: 'jhi-delivery-type-update',
  templateUrl: './delivery-type-update.component.html',
})
export class DeliveryTypeUpdateComponent implements OnInit {
  isSaving = false;
  deliveryTypesValues = Object.keys(DeliveryTypes);

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    deliveryType: [],
    minimumOrderQuantity: [],
    price: [],
    pricePerKilometre: [],
    product: [],
  });

  constructor(
    protected deliveryTypeService: DeliveryTypeService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deliveryType }) => {
      this.updateForm(deliveryType);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const deliveryType = this.createFromForm();
    if (deliveryType.id !== undefined) {
      this.subscribeToSaveResponse(this.deliveryTypeService.update(deliveryType));
    } else {
      this.subscribeToSaveResponse(this.deliveryTypeService.create(deliveryType));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDeliveryType>>): void {
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

  protected updateForm(deliveryType: IDeliveryType): void {
    this.editForm.patchValue({
      id: deliveryType.id,
      deliveryType: deliveryType.deliveryType,
      minimumOrderQuantity: deliveryType.minimumOrderQuantity,
      price: deliveryType.price,
      pricePerKilometre: deliveryType.pricePerKilometre,
      product: deliveryType.product,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      deliveryType.product
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IDeliveryType {
    return {
      ...new DeliveryType(),
      id: this.editForm.get(['id'])!.value,
      deliveryType: this.editForm.get(['deliveryType'])!.value,
      minimumOrderQuantity: this.editForm.get(['minimumOrderQuantity'])!.value,
      price: this.editForm.get(['price'])!.value,
      pricePerKilometre: this.editForm.get(['pricePerKilometre'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
