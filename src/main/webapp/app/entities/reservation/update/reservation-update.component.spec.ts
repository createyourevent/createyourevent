jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReservationService } from '../service/reservation.service';
import { IReservation, Reservation } from '../reservation.model';
import { IReservationTransactionId } from 'app/entities/reservation-transaction-id/reservation-transaction-id.model';
import { ReservationTransactionIdService } from 'app/entities/reservation-transaction-id/service/reservation-transaction-id.service';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { ReservationUpdateComponent } from './reservation-update.component';

describe('Reservation Management Update Component', () => {
  let comp: ReservationUpdateComponent;
  let fixture: ComponentFixture<ReservationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reservationService: ReservationService;
  let reservationTransactionIdService: ReservationTransactionIdService;
  let ticketService: TicketService;
  let userService: UserService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ReservationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ReservationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReservationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reservationService = TestBed.inject(ReservationService);
    reservationTransactionIdService = TestBed.inject(ReservationTransactionIdService);
    ticketService = TestBed.inject(TicketService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call transactionId query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const transactionId: IReservationTransactionId = { id: 68095 };
      reservation.transactionId = transactionId;

      const transactionIdCollection: IReservationTransactionId[] = [{ id: 3185 }];
      jest.spyOn(reservationTransactionIdService, 'query').mockReturnValue(of(new HttpResponse({ body: transactionIdCollection })));
      const expectedCollection: IReservationTransactionId[] = [transactionId, ...transactionIdCollection];
      jest.spyOn(reservationTransactionIdService, 'addReservationTransactionIdToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(reservationTransactionIdService.query).toHaveBeenCalled();
      expect(reservationTransactionIdService.addReservationTransactionIdToCollectionIfMissing).toHaveBeenCalledWith(
        transactionIdCollection,
        transactionId
      );
      expect(comp.transactionIdsCollection).toEqual(expectedCollection);
    });

    it('Should call ticket query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const ticket: ITicket = { id: 35725 };
      reservation.ticket = ticket;

      const ticketCollection: ITicket[] = [{ id: 51248 }];
      jest.spyOn(ticketService, 'query').mockReturnValue(of(new HttpResponse({ body: ticketCollection })));
      const expectedCollection: ITicket[] = [ticket, ...ticketCollection];
      jest.spyOn(ticketService, 'addTicketToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(ticketService.query).toHaveBeenCalled();
      expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(ticketCollection, ticket);
      expect(comp.ticketsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const user: IUser = { id: '298606d6-20a2-4ee1-a9f8-7dd3adbf3e94' };
      reservation.user = user;

      const userCollection: IUser[] = [{ id: '0f4f10f0-efb6-4bd7-9042-185e303ae68e' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const event: IEvent = { id: 41467 };
      reservation.event = event;

      const eventCollection: IEvent[] = [{ id: 16310 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reservation: IReservation = { id: 456 };
      const transactionId: IReservationTransactionId = { id: 23715 };
      reservation.transactionId = transactionId;
      const ticket: ITicket = { id: 2491 };
      reservation.ticket = ticket;
      const user: IUser = { id: '44c1d9fe-c9a3-4ccc-abec-3ce41be708a3' };
      reservation.user = user;
      const event: IEvent = { id: 23917 };
      reservation.event = event;

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(reservation));
      expect(comp.transactionIdsCollection).toContain(transactionId);
      expect(comp.ticketsCollection).toContain(ticket);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.eventsSharedCollection).toContain(event);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reservation>>();
      const reservation = { id: 123 };
      jest.spyOn(reservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reservation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(reservationService.update).toHaveBeenCalledWith(reservation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reservation>>();
      const reservation = new Reservation();
      jest.spyOn(reservationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reservation }));
      saveSubject.complete();

      // THEN
      expect(reservationService.create).toHaveBeenCalledWith(reservation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reservation>>();
      const reservation = { id: 123 };
      jest.spyOn(reservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reservationService.update).toHaveBeenCalledWith(reservation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackReservationTransactionIdById', () => {
      it('Should return tracked ReservationTransactionId primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackReservationTransactionIdById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTicketById', () => {
      it('Should return tracked Ticket primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTicketById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
