import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITags, Tags } from '../tags.model';
import { TagsService } from '../service/tags.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

@Component({
  selector: 'jhi-tags-update',
  templateUrl: './tags-update.component.html',
})
export class TagsUpdateComponent implements OnInit {
  isSaving = false;

  eventsSharedCollection: IEvent[] = [];
  productsSharedCollection: IProduct[] = [];
  shopsSharedCollection: IShop[] = [];
  createYourEventServicesSharedCollection: ICreateYourEventService[] = [];
  organizationsSharedCollection: IOrganization[] = [];

  editForm = this.fb.group({
    id: [],
    tag: [],
    event: [],
    product: [],
    shop: [],
    service: [],
    organization: [],
  });

  constructor(
    protected tagsService: TagsService,
    protected eventService: EventService,
    protected productService: ProductService,
    protected shopService: ShopService,
    protected createYourEventServiceService: CreateYourEventServiceService,
    protected organizationService: OrganizationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tags }) => {
      this.updateForm(tags);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tags = this.createFromForm();
    if (tags.id !== undefined) {
      this.subscribeToSaveResponse(this.tagsService.update(tags));
    } else {
      this.subscribeToSaveResponse(this.tagsService.create(tags));
    }
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

  trackCreateYourEventServiceById(index: number, item: ICreateYourEventService): number {
    return item.id!;
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITags>>): void {
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

  protected updateForm(tags: ITags): void {
    this.editForm.patchValue({
      id: tags.id,
      tag: tags.tag,
      event: tags.event,
      product: tags.product,
      shop: tags.shop,
      service: tags.service,
      organization: tags.organization,
    });

    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, tags.event);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, tags.product);
    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing(this.shopsSharedCollection, tags.shop);
    this.createYourEventServicesSharedCollection = this.createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing(
      this.createYourEventServicesSharedCollection,
      tags.service
    );
    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsSharedCollection,
      tags.organization
    );
  }

  protected loadRelationshipsOptions(): void {
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

    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(organizations, this.editForm.get('organization')!.value)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));
  }

  protected createFromForm(): ITags {
    return {
      ...new Tags(),
      id: this.editForm.get(['id'])!.value,
      tag: this.editForm.get(['tag'])!.value,
      event: this.editForm.get(['event'])!.value,
      product: this.editForm.get(['product'])!.value,
      shop: this.editForm.get(['shop'])!.value,
      service: this.editForm.get(['service'])!.value,
      organization: this.editForm.get(['organization'])!.value,
    };
  }
}
