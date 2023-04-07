import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventProductOrder, EventProductOrder } from '../event-product-order.model';
import { EventProductOrderService } from '../service/event-product-order.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from 'app/entities/cart/service/cart.service';
import { IDeliveryType } from 'app/entities/delivery-type/delivery-type.model';
import { DeliveryTypeService } from 'app/entities/delivery-type/service/delivery-type.service';
import { RentStatus } from 'app/entities/enumerations/rent-status.model';

@Component({
  selector: 'jhi-event-product-order-update',
  templateUrl: './event-product-order-update.component.html',
})
export class EventProductOrderUpdateComponent implements OnInit {
  isSaving = false;
  rentStatusValues = Object.keys(RentStatus);

  usersSharedCollection: IUser[] = [];
  eventsSharedCollection: IEvent[] = [];
  productsSharedCollection: IProduct[] = [];
  shopsSharedCollection: IShop[] = [];
  cartsSharedCollection: ICart[] = [];
  deliveryTypesSharedCollection: IDeliveryType[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [],
    total: [],
    date: [],
    rentalPeriod: [],
    dateFrom: [],
    dateUntil: [],
    status: [],
    billed: [],
    seen: [],
    approved: [],
    sellingPrice: [],
    user: [],
    event: [],
    product: [],
    shop: [],
    cart: [],
    deliveryType: [],
  });

  constructor(
    protected eventProductOrderService: EventProductOrderService,
    protected userService: UserService,
    protected eventService: EventService,
    protected productService: ProductService,
    protected shopService: ShopService,
    protected cartService: CartService,
    protected deliveryTypeService: DeliveryTypeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventProductOrder }) => {
      if (eventProductOrder.id === undefined) {
        const today = dayjs().startOf('day');
        eventProductOrder.date = today;
        eventProductOrder.dateFrom = today;
        eventProductOrder.dateUntil = today;
      }

      this.updateForm(eventProductOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventProductOrder = this.createFromForm();
    if (eventProductOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.eventProductOrderService.update(eventProductOrder));
    } else {
      this.subscribeToSaveResponse(this.eventProductOrderService.create(eventProductOrder));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackShopById(index: number, item: IShop): number {
    return item.id!;
  }

  trackCartById(index: number, item: ICart): number {
    return item.id!;
  }

  trackDeliveryTypeById(index: number, item: IDeliveryType): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventProductOrder>>): void {
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

  protected updateForm(eventProductOrder: IEventProductOrder): void {
    this.editForm.patchValue({
      id: eventProductOrder.id,
      amount: eventProductOrder.amount,
      total: eventProductOrder.total,
      date: eventProductOrder.date ? eventProductOrder.date.format(DATE_TIME_FORMAT) : null,
      rentalPeriod: eventProductOrder.rentalPeriod,
      dateFrom: eventProductOrder.dateFrom ? eventProductOrder.dateFrom.format(DATE_TIME_FORMAT) : null,
      dateUntil: eventProductOrder.dateUntil ? eventProductOrder.dateUntil.format(DATE_TIME_FORMAT) : null,
      status: eventProductOrder.status,
      billed: eventProductOrder.billed,
      seen: eventProductOrder.seen,
      approved: eventProductOrder.approved,
      sellingPrice: eventProductOrder.sellingPrice,
      user: eventProductOrder.user,
      event: eventProductOrder.event,
      product: eventProductOrder.product,
      shop: eventProductOrder.shop,
      cart: eventProductOrder.cart,
      deliveryType: eventProductOrder.deliveryType,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, eventProductOrder.user);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, eventProductOrder.event);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      eventProductOrder.product
    );
    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing(this.shopsSharedCollection, eventProductOrder.shop);
    this.cartsSharedCollection = this.cartService.addCartToCollectionIfMissing(this.cartsSharedCollection, eventProductOrder.cart);
    this.deliveryTypesSharedCollection = this.deliveryTypeService.addDeliveryTypeToCollectionIfMissing(
      this.deliveryTypesSharedCollection,
      eventProductOrder.deliveryType
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.shopService
      .query()
      .pipe(map((res: HttpResponse<IShop[]>) => res.body ?? []))
      .pipe(map((shops: IShop[]) => this.shopService.addShopToCollectionIfMissing(shops, this.editForm.get('shop')!.value)))
      .subscribe((shops: IShop[]) => (this.shopsSharedCollection = shops));

    this.cartService
      .query()
      .pipe(map((res: HttpResponse<ICart[]>) => res.body ?? []))
      .pipe(map((carts: ICart[]) => this.cartService.addCartToCollectionIfMissing(carts, this.editForm.get('cart')!.value)))
      .subscribe((carts: ICart[]) => (this.cartsSharedCollection = carts));

    this.deliveryTypeService
      .query()
      .pipe(map((res: HttpResponse<IDeliveryType[]>) => res.body ?? []))
      .pipe(
        map((deliveryTypes: IDeliveryType[]) =>
          this.deliveryTypeService.addDeliveryTypeToCollectionIfMissing(deliveryTypes, this.editForm.get('deliveryType')!.value)
        )
      )
      .subscribe((deliveryTypes: IDeliveryType[]) => (this.deliveryTypesSharedCollection = deliveryTypes));
  }

  protected createFromForm(): IEventProductOrder {
    return {
      ...new EventProductOrder(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      total: this.editForm.get(['total'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      rentalPeriod: this.editForm.get(['rentalPeriod'])!.value,
      dateFrom: this.editForm.get(['dateFrom'])!.value ? dayjs(this.editForm.get(['dateFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUntil: this.editForm.get(['dateUntil'])!.value ? dayjs(this.editForm.get(['dateUntil'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
      billed: this.editForm.get(['billed'])!.value,
      seen: this.editForm.get(['seen'])!.value,
      approved: this.editForm.get(['approved'])!.value,
      sellingPrice: this.editForm.get(['sellingPrice'])!.value,
      user: this.editForm.get(['user'])!.value,
      event: this.editForm.get(['event'])!.value,
      product: this.editForm.get(['product'])!.value,
      shop: this.editForm.get(['shop'])!.value,
      cart: this.editForm.get(['cart'])!.value,
      deliveryType: this.editForm.get(['deliveryType'])!.value,
    };
  }
}
