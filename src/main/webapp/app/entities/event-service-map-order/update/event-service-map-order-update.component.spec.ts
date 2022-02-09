jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventServiceMapOrderService } from '../service/event-service-map-order.service';
import { IEventServiceMapOrder, EventServiceMapOrder } from '../event-service-map-order.model';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ServiceMapService } from 'app/entities/service-map/service/service-map.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from 'app/entities/cart/service/cart.service';

import { EventServiceMapOrderUpdateComponent } from './event-service-map-order-update.component';

describe('EventServiceMapOrder Management Update Component', () => {
  let comp: EventServiceMapOrderUpdateComponent;
  let fixture: ComponentFixture<EventServiceMapOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventServiceMapOrderService: EventServiceMapOrderService;
  let eventService: EventService;
  let serviceMapService: ServiceMapService;
  let cartService: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventServiceMapOrderUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventServiceMapOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventServiceMapOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventServiceMapOrderService = TestBed.inject(EventServiceMapOrderService);
    eventService = TestBed.inject(EventService);
    serviceMapService = TestBed.inject(ServiceMapService);
    cartService = TestBed.inject(CartService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Event query and add missing value', () => {
      const eventServiceMapOrder: IEventServiceMapOrder = { id: 456 };
      const event: IEvent = { id: 74185 };
      eventServiceMapOrder.event = event;

      const eventCollection: IEvent[] = [{ id: 68598 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventServiceMapOrder });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ServiceMap query and add missing value', () => {
      const eventServiceMapOrder: IEventServiceMapOrder = { id: 456 };
      const serviceMap: IServiceMap = { id: 75724 };
      eventServiceMapOrder.serviceMap = serviceMap;

      const serviceMapCollection: IServiceMap[] = [{ id: 43747 }];
      jest.spyOn(serviceMapService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceMapCollection })));
      const additionalServiceMaps = [serviceMap];
      const expectedCollection: IServiceMap[] = [...additionalServiceMaps, ...serviceMapCollection];
      jest.spyOn(serviceMapService, 'addServiceMapToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventServiceMapOrder });
      comp.ngOnInit();

      expect(serviceMapService.query).toHaveBeenCalled();
      expect(serviceMapService.addServiceMapToCollectionIfMissing).toHaveBeenCalledWith(serviceMapCollection, ...additionalServiceMaps);
      expect(comp.serviceMapsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cart query and add missing value', () => {
      const eventServiceMapOrder: IEventServiceMapOrder = { id: 456 };
      const cart: ICart = { id: 2628 };
      eventServiceMapOrder.cart = cart;

      const cartCollection: ICart[] = [{ id: 81372 }];
      jest.spyOn(cartService, 'query').mockReturnValue(of(new HttpResponse({ body: cartCollection })));
      const additionalCarts = [cart];
      const expectedCollection: ICart[] = [...additionalCarts, ...cartCollection];
      jest.spyOn(cartService, 'addCartToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventServiceMapOrder });
      comp.ngOnInit();

      expect(cartService.query).toHaveBeenCalled();
      expect(cartService.addCartToCollectionIfMissing).toHaveBeenCalledWith(cartCollection, ...additionalCarts);
      expect(comp.cartsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventServiceMapOrder: IEventServiceMapOrder = { id: 456 };
      const event: IEvent = { id: 59939 };
      eventServiceMapOrder.event = event;
      const serviceMap: IServiceMap = { id: 12946 };
      eventServiceMapOrder.serviceMap = serviceMap;
      const cart: ICart = { id: 84717 };
      eventServiceMapOrder.cart = cart;

      activatedRoute.data = of({ eventServiceMapOrder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventServiceMapOrder));
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.serviceMapsSharedCollection).toContain(serviceMap);
      expect(comp.cartsSharedCollection).toContain(cart);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventServiceMapOrder>>();
      const eventServiceMapOrder = { id: 123 };
      jest.spyOn(eventServiceMapOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventServiceMapOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventServiceMapOrder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventServiceMapOrderService.update).toHaveBeenCalledWith(eventServiceMapOrder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventServiceMapOrder>>();
      const eventServiceMapOrder = new EventServiceMapOrder();
      jest.spyOn(eventServiceMapOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventServiceMapOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventServiceMapOrder }));
      saveSubject.complete();

      // THEN
      expect(eventServiceMapOrderService.create).toHaveBeenCalledWith(eventServiceMapOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventServiceMapOrder>>();
      const eventServiceMapOrder = { id: 123 };
      jest.spyOn(eventServiceMapOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventServiceMapOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventServiceMapOrderService.update).toHaveBeenCalledWith(eventServiceMapOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackServiceMapById', () => {
      it('Should return tracked ServiceMap primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackServiceMapById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCartById', () => {
      it('Should return tracked Cart primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCartById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
