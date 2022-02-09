jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FeeTransactionService } from '../service/fee-transaction.service';
import { IFeeTransaction, FeeTransaction } from '../fee-transaction.model';
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

import { FeeTransactionUpdateComponent } from './fee-transaction-update.component';

describe('FeeTransaction Management Update Component', () => {
  let comp: FeeTransactionUpdateComponent;
  let fixture: ComponentFixture<FeeTransactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feeTransactionService: FeeTransactionService;
  let feeTransactionIdService: FeeTransactionIdService;
  let eventProductOrderService: EventProductOrderService;
  let eventServiceMapOrderService: EventServiceMapOrderService;
  let eventService: EventService;
  let organizationReservationService: OrganizationReservationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FeeTransactionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FeeTransactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeeTransactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feeTransactionService = TestBed.inject(FeeTransactionService);
    feeTransactionIdService = TestBed.inject(FeeTransactionIdService);
    eventProductOrderService = TestBed.inject(EventProductOrderService);
    eventServiceMapOrderService = TestBed.inject(EventServiceMapOrderService);
    eventService = TestBed.inject(EventService);
    organizationReservationService = TestBed.inject(OrganizationReservationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call transactionId query and add missing value', () => {
      const feeTransaction: IFeeTransaction = { id: 456 };
      const transactionId: IFeeTransactionId = { id: 90910 };
      feeTransaction.transactionId = transactionId;

      const transactionIdCollection: IFeeTransactionId[] = [{ id: 97162 }];
      jest.spyOn(feeTransactionIdService, 'query').mockReturnValue(of(new HttpResponse({ body: transactionIdCollection })));
      const expectedCollection: IFeeTransactionId[] = [transactionId, ...transactionIdCollection];
      jest.spyOn(feeTransactionIdService, 'addFeeTransactionIdToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      expect(feeTransactionIdService.query).toHaveBeenCalled();
      expect(feeTransactionIdService.addFeeTransactionIdToCollectionIfMissing).toHaveBeenCalledWith(transactionIdCollection, transactionId);
      expect(comp.transactionIdsCollection).toEqual(expectedCollection);
    });

    it('Should call eventProductOrder query and add missing value', () => {
      const feeTransaction: IFeeTransaction = { id: 456 };
      const eventProductOrder: IEventProductOrder = { id: 83690 };
      feeTransaction.eventProductOrder = eventProductOrder;

      const eventProductOrderCollection: IEventProductOrder[] = [{ id: 41531 }];
      jest.spyOn(eventProductOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: eventProductOrderCollection })));
      const expectedCollection: IEventProductOrder[] = [eventProductOrder, ...eventProductOrderCollection];
      jest.spyOn(eventProductOrderService, 'addEventProductOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      expect(eventProductOrderService.query).toHaveBeenCalled();
      expect(eventProductOrderService.addEventProductOrderToCollectionIfMissing).toHaveBeenCalledWith(
        eventProductOrderCollection,
        eventProductOrder
      );
      expect(comp.eventProductOrdersCollection).toEqual(expectedCollection);
    });

    it('Should call eventServiceMapOrder query and add missing value', () => {
      const feeTransaction: IFeeTransaction = { id: 456 };
      const eventServiceMapOrder: IEventServiceMapOrder = { id: 10211 };
      feeTransaction.eventServiceMapOrder = eventServiceMapOrder;

      const eventServiceMapOrderCollection: IEventServiceMapOrder[] = [{ id: 15360 }];
      jest.spyOn(eventServiceMapOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: eventServiceMapOrderCollection })));
      const expectedCollection: IEventServiceMapOrder[] = [eventServiceMapOrder, ...eventServiceMapOrderCollection];
      jest.spyOn(eventServiceMapOrderService, 'addEventServiceMapOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      expect(eventServiceMapOrderService.query).toHaveBeenCalled();
      expect(eventServiceMapOrderService.addEventServiceMapOrderToCollectionIfMissing).toHaveBeenCalledWith(
        eventServiceMapOrderCollection,
        eventServiceMapOrder
      );
      expect(comp.eventServiceMapOrdersCollection).toEqual(expectedCollection);
    });

    it('Should call event query and add missing value', () => {
      const feeTransaction: IFeeTransaction = { id: 456 };
      const event: IEvent = { id: 1160 };
      feeTransaction.event = event;

      const eventCollection: IEvent[] = [{ id: 40876 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const expectedCollection: IEvent[] = [event, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, event);
      expect(comp.eventsCollection).toEqual(expectedCollection);
    });

    it('Should call organizationReservation query and add missing value', () => {
      const feeTransaction: IFeeTransaction = { id: 456 };
      const organizationReservation: IOrganizationReservation = { id: 49635 };
      feeTransaction.organizationReservation = organizationReservation;

      const organizationReservationCollection: IOrganizationReservation[] = [{ id: 45062 }];
      jest
        .spyOn(organizationReservationService, 'query')
        .mockReturnValue(of(new HttpResponse({ body: organizationReservationCollection })));
      const expectedCollection: IOrganizationReservation[] = [organizationReservation, ...organizationReservationCollection];
      jest.spyOn(organizationReservationService, 'addOrganizationReservationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      expect(organizationReservationService.query).toHaveBeenCalled();
      expect(organizationReservationService.addOrganizationReservationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationReservationCollection,
        organizationReservation
      );
      expect(comp.organizationReservationsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const feeTransaction: IFeeTransaction = { id: 456 };
      const user: IUser = { id: 'e7e40329-b5e2-4b61-8386-187f38b61ec9' };
      feeTransaction.user = user;

      const userCollection: IUser[] = [{ id: 'f108bd75-8cb7-44b7-a6fd-1f7963dac9ba' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const feeTransaction: IFeeTransaction = { id: 456 };
      const transactionId: IFeeTransactionId = { id: 46996 };
      feeTransaction.transactionId = transactionId;
      const eventProductOrder: IEventProductOrder = { id: 68303 };
      feeTransaction.eventProductOrder = eventProductOrder;
      const eventServiceMapOrder: IEventServiceMapOrder = { id: 28119 };
      feeTransaction.eventServiceMapOrder = eventServiceMapOrder;
      const event: IEvent = { id: 15493 };
      feeTransaction.event = event;
      const organizationReservation: IOrganizationReservation = { id: 68380 };
      feeTransaction.organizationReservation = organizationReservation;
      const user: IUser = { id: '70fdba33-17ff-4a02-aece-4be6bddd2835' };
      feeTransaction.user = user;

      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(feeTransaction));
      expect(comp.transactionIdsCollection).toContain(transactionId);
      expect(comp.eventProductOrdersCollection).toContain(eventProductOrder);
      expect(comp.eventServiceMapOrdersCollection).toContain(eventServiceMapOrder);
      expect(comp.eventsCollection).toContain(event);
      expect(comp.organizationReservationsCollection).toContain(organizationReservation);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransaction>>();
      const feeTransaction = { id: 123 };
      jest.spyOn(feeTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeTransaction }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(feeTransactionService.update).toHaveBeenCalledWith(feeTransaction);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransaction>>();
      const feeTransaction = new FeeTransaction();
      jest.spyOn(feeTransactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeTransaction }));
      saveSubject.complete();

      // THEN
      expect(feeTransactionService.create).toHaveBeenCalledWith(feeTransaction);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransaction>>();
      const feeTransaction = { id: 123 };
      jest.spyOn(feeTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feeTransactionService.update).toHaveBeenCalledWith(feeTransaction);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFeeTransactionIdById', () => {
      it('Should return tracked FeeTransactionId primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFeeTransactionIdById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEventProductOrderById', () => {
      it('Should return tracked EventProductOrder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventProductOrderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEventServiceMapOrderById', () => {
      it('Should return tracked EventServiceMapOrder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventServiceMapOrderById(0, entity);
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

    describe('trackOrganizationReservationById', () => {
      it('Should return tracked OrganizationReservation primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrganizationReservationById(0, entity);
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
  });
});
