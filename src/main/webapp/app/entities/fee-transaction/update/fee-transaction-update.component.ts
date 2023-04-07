import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFeeTransaction, FeeTransaction } from '../fee-transaction.model';
import { FeeTransactionService } from '../service/fee-transaction.service';
import { IFeeTransactionId } from 'app/entities/fee-transaction-id/fee-transaction-id.model';
import { FeeTransactionIdService } from 'app/entities/fee-transaction-id/service/fee-transaction-id.service';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { EventProductOrderService } from 'app/entities/event-product-order/service/event-product-order.service';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { EventServiceMapOrderService } from 'app/entities/event-service-map-order/service/event-service-map-order.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IOrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';
import { OrganizationReservationService } from 'app/entities/organization-reservation/service/organization-reservation.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-fee-transaction-update',
  templateUrl: './fee-transaction-update.component.html',
})
export class FeeTransactionUpdateComponent implements OnInit {
  isSaving = false;

  transactionIdsCollection: IFeeTransactionId[] = [];
  eventProductOrdersCollection: IEventProductOrder[] = [];
  eventServiceMapOrdersCollection: IEventServiceMapOrder[] = [];
  eventsCollection: IEvent[] = [];
  organizationReservationsCollection: IOrganizationReservation[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    transactionId: [],
    eventProductOrder: [],
    eventServiceMapOrder: [],
    event: [],
    organizationReservation: [],
    user: [],
  });

  constructor(
    protected feeTransactionService: FeeTransactionService,
    protected feeTransactionIdService: FeeTransactionIdService,
    protected eventProductOrderService: EventProductOrderService,
    protected eventServiceMapOrderService: EventServiceMapOrderService,
    protected eventService: EventService,
    protected organizationReservationService: OrganizationReservationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feeTransaction }) => {
      if (feeTransaction.id === undefined) {
        const today = dayjs().startOf('day');
        feeTransaction.date = today;
      }

      this.updateForm(feeTransaction);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const feeTransaction = this.createFromForm();
    if (feeTransaction.id !== undefined) {
      this.subscribeToSaveResponse(this.feeTransactionService.update(feeTransaction));
    } else {
      this.subscribeToSaveResponse(this.feeTransactionService.create(feeTransaction));
    }
  }

  trackFeeTransactionIdById(index: number, item: IFeeTransactionId): number {
    return item.id!;
  }

  trackEventProductOrderById(index: number, item: IEventProductOrder): number {
    return item.id!;
  }

  trackEventServiceMapOrderById(index: number, item: IEventServiceMapOrder): number {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackOrganizationReservationById(index: number, item: IOrganizationReservation): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFeeTransaction>>): void {
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

  protected updateForm(feeTransaction: IFeeTransaction): void {
    this.editForm.patchValue({
      id: feeTransaction.id,
      date: feeTransaction.date ? feeTransaction.date.format(DATE_TIME_FORMAT) : null,
      transactionId: feeTransaction.transactionId,
      eventProductOrder: feeTransaction.eventProductOrder,
      eventServiceMapOrder: feeTransaction.eventServiceMapOrder,
      event: feeTransaction.event,
      organizationReservation: feeTransaction.organizationReservation,
      user: feeTransaction.user,
    });

    this.transactionIdsCollection = this.feeTransactionIdService.addFeeTransactionIdToCollectionIfMissing(
      this.transactionIdsCollection,
      feeTransaction.transactionId
    );
    this.eventProductOrdersCollection = this.eventProductOrderService.addEventProductOrderToCollectionIfMissing(
      this.eventProductOrdersCollection,
      feeTransaction.eventProductOrder
    );
    this.eventServiceMapOrdersCollection = this.eventServiceMapOrderService.addEventServiceMapOrderToCollectionIfMissing(
      this.eventServiceMapOrdersCollection,
      feeTransaction.eventServiceMapOrder
    );
    this.eventsCollection = this.eventService.addEventToCollectionIfMissing(this.eventsCollection, feeTransaction.event);
    this.organizationReservationsCollection = this.organizationReservationService.addOrganizationReservationToCollectionIfMissing(
      this.organizationReservationsCollection,
      feeTransaction.organizationReservation
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, feeTransaction.user);
  }

  protected loadRelationshipsOptions(): void {
    this.feeTransactionIdService
      .query({ filter: 'feetransaction-is-null' })
      .pipe(map((res: HttpResponse<IFeeTransactionId[]>) => res.body ?? []))
      .pipe(
        map((feeTransactionIds: IFeeTransactionId[]) =>
          this.feeTransactionIdService.addFeeTransactionIdToCollectionIfMissing(
            feeTransactionIds,
            this.editForm.get('transactionId')!.value
          )
        )
      )
      .subscribe((feeTransactionIds: IFeeTransactionId[]) => (this.transactionIdsCollection = feeTransactionIds));

    this.eventProductOrderService
      .query({ filter: 'feetransaction-is-null' })
      .pipe(map((res: HttpResponse<IEventProductOrder[]>) => res.body ?? []))
      .pipe(
        map((eventProductOrders: IEventProductOrder[]) =>
          this.eventProductOrderService.addEventProductOrderToCollectionIfMissing(
            eventProductOrders,
            this.editForm.get('eventProductOrder')!.value
          )
        )
      )
      .subscribe((eventProductOrders: IEventProductOrder[]) => (this.eventProductOrdersCollection = eventProductOrders));

    this.eventServiceMapOrderService
      .query({ filter: 'feetransaction-is-null' })
      .pipe(map((res: HttpResponse<IEventServiceMapOrder[]>) => res.body ?? []))
      .pipe(
        map((eventServiceMapOrders: IEventServiceMapOrder[]) =>
          this.eventServiceMapOrderService.addEventServiceMapOrderToCollectionIfMissing(
            eventServiceMapOrders,
            this.editForm.get('eventServiceMapOrder')!.value
          )
        )
      )
      .subscribe((eventServiceMapOrders: IEventServiceMapOrder[]) => (this.eventServiceMapOrdersCollection = eventServiceMapOrders));

    this.eventService
      .query({ filter: 'feetransaction-is-null' })
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsCollection = events));

    this.organizationReservationService
      .query({ filter: 'feetransaction-is-null' })
      .pipe(map((res: HttpResponse<IOrganizationReservation[]>) => res.body ?? []))
      .pipe(
        map((organizationReservations: IOrganizationReservation[]) =>
          this.organizationReservationService.addOrganizationReservationToCollectionIfMissing(
            organizationReservations,
            this.editForm.get('organizationReservation')!.value
          )
        )
      )
      .subscribe(
        (organizationReservations: IOrganizationReservation[]) => (this.organizationReservationsCollection = organizationReservations)
      );

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFeeTransaction {
    return {
      ...new FeeTransaction(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      transactionId: this.editForm.get(['transactionId'])!.value,
      eventProductOrder: this.editForm.get(['eventProductOrder'])!.value,
      eventServiceMapOrder: this.editForm.get(['eventServiceMapOrder'])!.value,
      event: this.editForm.get(['event'])!.value,
      organizationReservation: this.editForm.get(['organizationReservation'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
