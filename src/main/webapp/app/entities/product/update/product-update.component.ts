import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { RentType } from 'app/entities/enumerations/rent-type.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { Unit } from 'app/entities/enumerations/unit.model';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  priceTypeValues = Object.keys(PriceType);
  rentTypeValues = Object.keys(RentType);
  productTypeValues = Object.keys(ProductType);
  orderStatusValues = Object.keys(OrderStatus);
  unitValues = Object.keys(Unit);

  shopsSharedCollection: IShop[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    keywords: [],
    description: [null, [Validators.required]],
    dateAdded: [],
    dateModified: [],
    priceType: [],
    rentType: [],
    price: [null, [Validators.required]],
    photo: [null, [Validators.required]],
    photoContentType: [],
    photo2: [],
    photo2ContentType: [],
    photo3: [],
    photo3ContentType: [],
    youtube: [],
    active: [],
    stock: [null, [Validators.required]],
    productType: [],
    itemNumber: [],
    status: [],
    unit: [null, [Validators.required]],
    amount: [],
    motto: [null, [Validators.required]],
    shop: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected productService: ProductService,
    protected shopService: ShopService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      if (product.id === undefined) {
        const today = dayjs().startOf('day');
        product.dateAdded = today;
        product.dateModified = today;
      }

      this.updateForm(product);

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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackShopById(index: number, item: IShop): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      title: product.title,
      keywords: product.keywords,
      description: product.description,
      dateAdded: product.dateAdded ? product.dateAdded.format(DATE_TIME_FORMAT) : null,
      dateModified: product.dateModified ? product.dateModified.format(DATE_TIME_FORMAT) : null,
      priceType: product.priceType,
      rentType: product.rentType,
      price: product.price,
      photo: product.photo,
      photoContentType: product.photoContentType,
      photo2: product.photo2,
      photo2ContentType: product.photo2ContentType,
      photo3: product.photo3,
      photo3ContentType: product.photo3ContentType,
      youtube: product.youtube,
      active: product.active,
      stock: product.stock,
      productType: product.productType,
      itemNumber: product.itemNumber,
      status: product.status,
      unit: product.unit,
      amount: product.amount,
      motto: product.motto,
      shop: product.shop,
    });

    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing(this.shopsSharedCollection, product.shop);
  }

  protected loadRelationshipsOptions(): void {
    this.shopService
      .query()
      .pipe(map((res: HttpResponse<IShop[]>) => res.body ?? []))
      .pipe(map((shops: IShop[]) => this.shopService.addShopToCollectionIfMissing(shops, this.editForm.get('shop')!.value)))
      .subscribe((shops: IShop[]) => (this.shopsSharedCollection = shops));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      keywords: this.editForm.get(['keywords'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateAdded: this.editForm.get(['dateAdded'])!.value ? dayjs(this.editForm.get(['dateAdded'])!.value, DATE_TIME_FORMAT) : undefined,
      dateModified: this.editForm.get(['dateModified'])!.value
        ? dayjs(this.editForm.get(['dateModified'])!.value, DATE_TIME_FORMAT)
        : undefined,
      priceType: this.editForm.get(['priceType'])!.value,
      rentType: this.editForm.get(['rentType'])!.value,
      price: this.editForm.get(['price'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      photo2ContentType: this.editForm.get(['photo2ContentType'])!.value,
      photo2: this.editForm.get(['photo2'])!.value,
      photo3ContentType: this.editForm.get(['photo3ContentType'])!.value,
      photo3: this.editForm.get(['photo3'])!.value,
      youtube: this.editForm.get(['youtube'])!.value,
      active: this.editForm.get(['active'])!.value,
      stock: this.editForm.get(['stock'])!.value,
      productType: this.editForm.get(['productType'])!.value,
      itemNumber: this.editForm.get(['itemNumber'])!.value,
      status: this.editForm.get(['status'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      shop: this.editForm.get(['shop'])!.value,
    };
  }
}
