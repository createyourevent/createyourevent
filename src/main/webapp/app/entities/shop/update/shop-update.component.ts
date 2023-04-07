import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IShop, Shop } from '../shop.model';
import { ShopService } from '../service/shop.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ProductType } from 'app/entities/enumerations/product-type.model';

@Component({
  selector: 'jhi-shop-update',
  templateUrl: './shop-update.component.html',
})
export class ShopUpdateComponent implements OnInit {
  isSaving = false;
  productTypeValues = Object.keys(ProductType);

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    productType: [null, [Validators.required]],
    logo: [],
    logoContentType: [],
    active: [],
    activeOwner: [],
    description: [null, [Validators.required]],
    address: [null, [Validators.required]],
    motto: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    webAddress: [],
    user: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected shopService: ShopService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shop }) => {
      this.updateForm(shop);

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
    const shop = this.createFromForm();
    if (shop.id !== undefined) {
      this.subscribeToSaveResponse(this.shopService.update(shop));
    } else {
      this.subscribeToSaveResponse(this.shopService.create(shop));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShop>>): void {
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

  protected updateForm(shop: IShop): void {
    this.editForm.patchValue({
      id: shop.id,
      name: shop.name,
      productType: shop.productType,
      logo: shop.logo,
      logoContentType: shop.logoContentType,
      active: shop.active,
      activeOwner: shop.activeOwner,
      description: shop.description,
      address: shop.address,
      motto: shop.motto,
      phone: shop.phone,
      webAddress: shop.webAddress,
      user: shop.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, shop.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IShop {
    return {
      ...new Shop(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      productType: this.editForm.get(['productType'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      active: this.editForm.get(['active'])!.value,
      activeOwner: this.editForm.get(['activeOwner'])!.value,
      description: this.editForm.get(['description'])!.value,
      address: this.editForm.get(['address'])!.value,
      motto: this.editForm.get(['motto'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      webAddress: this.editForm.get(['webAddress'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
