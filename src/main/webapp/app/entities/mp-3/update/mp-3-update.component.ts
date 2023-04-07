import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMp3, Mp3 } from '../mp-3.model';
import { Mp3Service } from '../service/mp-3.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';

@Component({
  selector: 'jhi-mp-3-update',
  templateUrl: './mp-3-update.component.html',
})
export class Mp3UpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  productsSharedCollection: IProduct[] = [];
  shopsSharedCollection: IShop[] = [];
  eventsSharedCollection: IEvent[] = [];
  createYourEventServicesSharedCollection: ICreateYourEventService[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    artists: [],
    duration: [],
    url: [],
    user: [],
    product: [],
    shop: [],
    event: [],
    service: [],
  });

  constructor(
    protected mp3Service: Mp3Service,
    protected userService: UserService,
    protected productService: ProductService,
    protected shopService: ShopService,
    protected eventService: EventService,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mp3 }) => {
      this.updateForm(mp3);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mp3 = this.createFromForm();
    if (mp3.id !== undefined) {
      this.subscribeToSaveResponse(this.mp3Service.update(mp3));
    } else {
      this.subscribeToSaveResponse(this.mp3Service.create(mp3));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackShopById(index: number, item: IShop): number {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackCreateYourEventServiceById(index: number, item: ICreateYourEventService): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMp3>>): void {
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

  protected updateForm(mp3: IMp3): void {
    this.editForm.patchValue({
      id: mp3.id,
      title: mp3.title,
      artists: mp3.artists,
      duration: mp3.duration,
      url: mp3.url,
      user: mp3.user,
      product: mp3.product,
      shop: mp3.shop,
      event: mp3.event,
      service: mp3.service,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, mp3.user);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, mp3.product);
    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing(this.shopsSharedCollection, mp3.shop);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, mp3.event);
    this.createYourEventServicesSharedCollection = this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
      this.createYourEventServicesSharedCollection,
      mp3.service
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

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

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.createYourEventServiceService
      .query()
      .pipe(map((res: HttpResponse<ICreateYourEventService[]>) => res.body ?? []))
      .pipe(
        map((createYourEventServices: ICreateYourEventService[]) =>
          this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
            createYourEventServices,
            this.editForm.get('service')!.value
          )
        )
      )
      .subscribe(
        (createYourEventServices: ICreateYourEventService[]) => (this.createYourEventServicesSharedCollection = createYourEventServices)
      );
  }

  protected createFromForm(): IMp3 {
    return {
      ...new Mp3(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      artists: this.editForm.get(['artists'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      url: this.editForm.get(['url'])!.value,
      user: this.editForm.get(['user'])!.value,
      product: this.editForm.get(['product'])!.value,
      shop: this.editForm.get(['shop'])!.value,
      event: this.editForm.get(['event'])!.value,
      service: this.editForm.get(['service'])!.value,
    };
  }
}
