import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IReservation, Reservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';
import { IReservationTransactionId } from 'app/entities/reservation-transaction-id/reservation-transaction-id.model';
import { ReservationTransactionIdService } from 'app/entities/reservation-transaction-id/service/reservation-transaction-id.service';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

@Component({
  selector: 'jhi-reservation-update',
  templateUrl: './reservation-update.component.html',
})
export class ReservationUpdateComponent implements OnInit {
  isSaving = false;

  transactionIdsCollection: IReservationTransactionId[] = [];
  ticketsCollection: ITicket[] = [];
  usersSharedCollection: IUser[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    billed: [],
    accessEvent: [],
    accessDate: [],
    tdTxId: [],
    transactionId: [],
    ticket: [],
    user: [],
    event: [],
  });

  constructor(
    protected reservationService: ReservationService,
    protected reservationTransactionIdService: ReservationTransactionIdService,
    protected ticketService: TicketService,
    protected userService: UserService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      if (reservation.id === undefined) {
        const today = dayjs().startOf('day');
        reservation.date = today;
        reservation.accessDate = today;
      }

      this.updateForm(reservation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reservation = this.createFromForm();
    if (reservation.id !== undefined) {
      this.subscribeToSaveResponse(this.reservationService.update(reservation));
    } else {
      this.subscribeToSaveResponse(this.reservationService.create(reservation));
    }
  }

  trackReservationTransactionIdById(index: number, item: IReservationTransactionId): number {
    return item.id!;
  }

  trackTicketById(index: number, item: ITicket): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>): void {
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

  protected updateForm(reservation: IReservation): void {
    this.editForm.patchValue({
      id: reservation.id,
      date: reservation.date ? reservation.date.format(DATE_TIME_FORMAT) : null,
      billed: reservation.billed,
      accessEvent: reservation.accessEvent,
      accessDate: reservation.accessDate ? reservation.accessDate.format(DATE_TIME_FORMAT) : null,
      tdTxId: reservation.tdTxId,
      transactionId: reservation.transactionId,
      ticket: reservation.ticket,
      user: reservation.user,
      event: reservation.event,
    });

    this.transactionIdsCollection = this.reservationTransactionIdService.addReservationTransactionIdToCollectionIfMissing(
      this.transactionIdsCollection,
      reservation.transactionId
    );
    this.ticketsCollection = this.ticketService.addTicketToCollectionIfMissing(this.ticketsCollection, reservation.ticket);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, reservation.user);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, reservation.event);
  }

  protected loadRelationshipsOptions(): void {
    this.reservationTransactionIdService
      .query({ filter: 'reservation-is-null' })
      .pipe(map((res: HttpResponse<IReservationTransactionId[]>) => res.body ?? []))
      .pipe(
        map((reservationTransactionIds: IReservationTransactionId[]) =>
          this.reservationTransactionIdService.addReservationTransactionIdToCollectionIfMissing(
            reservationTransactionIds,
            this.editForm.get('transactionId')!.value
          )
        )
      )
      .subscribe((reservationTransactionIds: IReservationTransactionId[]) => (this.transactionIdsCollection = reservationTransactionIds));

    this.ticketService
      .query({ filter: 'reservation-is-null' })
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing(tickets, this.editForm.get('ticket')!.value)))
      .subscribe((tickets: ITicket[]) => (this.ticketsCollection = tickets));

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
  }

  protected createFromForm(): IReservation {
    return {
      ...new Reservation(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      billed: this.editForm.get(['billed'])!.value,
      accessEvent: this.editForm.get(['accessEvent'])!.value,
      accessDate: this.editForm.get(['accessDate'])!.value ? dayjs(this.editForm.get(['accessDate'])!.value, DATE_TIME_FORMAT) : undefined,
      tdTxId: this.editForm.get(['tdTxId'])!.value,
      transactionId: this.editForm.get(['transactionId'])!.value,
      ticket: this.editForm.get(['ticket'])!.value,
      user: this.editForm.get(['user'])!.value,
      event: this.editForm.get(['event'])!.value,
    };
  }
}
