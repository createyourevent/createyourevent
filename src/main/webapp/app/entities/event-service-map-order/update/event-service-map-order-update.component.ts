import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventServiceMapOrder, EventServiceMapOrder } from '../event-service-map-order.model';
import { EventServiceMapOrderService } from '../service/event-service-map-order.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ServiceMapService } from 'app/entities/service-map/service/service-map.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from 'app/entities/cart/service/cart.service';

@Component({
  selector: 'jhi-event-service-map-order-update',
  templateUrl: './event-service-map-order-update.component.html',
})
export class EventServiceMapOrderUpdateComponent implements OnInit {
  isSaving = false;

  eventsSharedCollection: IEvent[] = [];
  serviceMapsSharedCollection: IServiceMap[] = [];
  cartsSharedCollection: ICart[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    dateFrom: [],
    dateUntil: [],
    costHour: [],
    rideCosts: [],
    total: [],
    totalHours: [],
    kilometre: [],
    billed: [],
    seen: [],
    approved: [],
    event: [],
    serviceMap: [],
    cart: [],
  });

  constructor(
    protected eventServiceMapOrderService: EventServiceMapOrderService,
    protected eventService: EventService,
    protected serviceMapService: ServiceMapService,
    protected cartService: CartService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventServiceMapOrder }) => {
      if (eventServiceMapOrder.id === undefined) {
        const today = dayjs().startOf('day');
        eventServiceMapOrder.date = today;
        eventServiceMapOrder.dateFrom = today;
        eventServiceMapOrder.dateUntil = today;
      }

      this.updateForm(eventServiceMapOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventServiceMapOrder = this.createFromForm();
    if (eventServiceMapOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.eventServiceMapOrderService.update(eventServiceMapOrder));
    } else {
      this.subscribeToSaveResponse(this.eventServiceMapOrderService.create(eventServiceMapOrder));
    }
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackServiceMapById(index: number, item: IServiceMap): number {
    return item.id!;
  }

  trackCartById(index: number, item: ICart): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventServiceMapOrder>>): void {
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

  protected updateForm(eventServiceMapOrder: IEventServiceMapOrder): void {
    this.editForm.patchValue({
      id: eventServiceMapOrder.id,
      date: eventServiceMapOrder.date ? eventServiceMapOrder.date.format(DATE_TIME_FORMAT) : null,
      dateFrom: eventServiceMapOrder.dateFrom ? eventServiceMapOrder.dateFrom.format(DATE_TIME_FORMAT) : null,
      dateUntil: eventServiceMapOrder.dateUntil ? eventServiceMapOrder.dateUntil.format(DATE_TIME_FORMAT) : null,
      costHour: eventServiceMapOrder.costHour,
      rideCosts: eventServiceMapOrder.rideCosts,
      total: eventServiceMapOrder.total,
      totalHours: eventServiceMapOrder.totalHours,
      kilometre: eventServiceMapOrder.kilometre,
      billed: eventServiceMapOrder.billed,
      seen: eventServiceMapOrder.seen,
      approved: eventServiceMapOrder.approved,
      event: eventServiceMapOrder.event,
      serviceMap: eventServiceMapOrder.serviceMap,
      cart: eventServiceMapOrder.cart,
    });

    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, eventServiceMapOrder.event);
    this.serviceMapsSharedCollection = this.serviceMapService.addServiceMapToCollectionIfMissing(
      this.serviceMapsSharedCollection,
      eventServiceMapOrder.serviceMap
    );
    this.cartsSharedCollection = this.cartService.addCartToCollectionIfMissing(this.cartsSharedCollection, eventServiceMapOrder.cart);
  }

  protected loadRelationshipsOptions(): void {
    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.serviceMapService
      .query()
      .pipe(map((res: HttpResponse<IServiceMap[]>) => res.body ?? []))
      .pipe(
        map((serviceMaps: IServiceMap[]) =>
          this.serviceMapService.addServiceMapToCollectionIfMissing(serviceMaps, this.editForm.get('serviceMap')!.value)
        )
      )
      .subscribe((serviceMaps: IServiceMap[]) => (this.serviceMapsSharedCollection = serviceMaps));

    this.cartService
      .query()
      .pipe(map((res: HttpResponse<ICart[]>) => res.body ?? []))
      .pipe(map((carts: ICart[]) => this.cartService.addCartToCollectionIfMissing(carts, this.editForm.get('cart')!.value)))
      .subscribe((carts: ICart[]) => (this.cartsSharedCollection = carts));
  }

  protected createFromForm(): IEventServiceMapOrder {
    return {
      ...new EventServiceMapOrder(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      dateFrom: this.editForm.get(['dateFrom'])!.value ? dayjs(this.editForm.get(['dateFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUntil: this.editForm.get(['dateUntil'])!.value ? dayjs(this.editForm.get(['dateUntil'])!.value, DATE_TIME_FORMAT) : undefined,
      costHour: this.editForm.get(['costHour'])!.value,
      rideCosts: this.editForm.get(['rideCosts'])!.value,
      total: this.editForm.get(['total'])!.value,
      totalHours: this.editForm.get(['totalHours'])!.value,
      kilometre: this.editForm.get(['kilometre'])!.value,
      billed: this.editForm.get(['billed'])!.value,
      seen: this.editForm.get(['seen'])!.value,
      approved: this.editForm.get(['approved'])!.value,
      event: this.editForm.get(['event'])!.value,
      serviceMap: this.editForm.get(['serviceMap'])!.value,
      cart: this.editForm.get(['cart'])!.value,
    };
  }
}
