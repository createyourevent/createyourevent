jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventProductRatingService } from '../service/event-product-rating.service';
import { IEventProductRating, EventProductRating } from '../event-product-rating.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { EventProductRatingUpdateComponent } from './event-product-rating-update.component';

describe('EventProductRating Management Update Component', () => {
  let comp: EventProductRatingUpdateComponent;
  let fixture: ComponentFixture<EventProductRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventProductRatingService: EventProductRatingService;
  let productService: ProductService;
  let eventService: EventService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventProductRatingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventProductRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventProductRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventProductRatingService = TestBed.inject(EventProductRatingService);
    productService = TestBed.inject(ProductService);
    eventService = TestBed.inject(EventService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const eventProductRating: IEventProductRating = { id: 456 };
      const product: IProduct = { id: 3280 };
      eventProductRating.product = product;

      const productCollection: IProduct[] = [{ id: 35526 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductRating });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const eventProductRating: IEventProductRating = { id: 456 };
      const event: IEvent = { id: 12316 };
      eventProductRating.event = event;

      const eventCollection: IEvent[] = [{ id: 78749 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductRating });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const eventProductRating: IEventProductRating = { id: 456 };
      const user: IUser = { id: 'eb2a49b2-6b69-4897-918a-8bf7706b5e4b' };
      eventProductRating.user = user;

      const userCollection: IUser[] = [{ id: '64035839-ac2d-4a42-8dd2-d9d67fa002fb' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventProductRating: IEventProductRating = { id: 456 };
      const product: IProduct = { id: 50249 };
      eventProductRating.product = product;
      const event: IEvent = { id: 43607 };
      eventProductRating.event = event;
      const user: IUser = { id: 'e8e2b5f2-bd93-4fa7-800c-a1aa81d8ae64' };
      eventProductRating.user = user;

      activatedRoute.data = of({ eventProductRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventProductRating));
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductRating>>();
      const eventProductRating = { id: 123 };
      jest.spyOn(eventProductRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventProductRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventProductRatingService.update).toHaveBeenCalledWith(eventProductRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductRating>>();
      const eventProductRating = new EventProductRating();
      jest.spyOn(eventProductRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventProductRating }));
      saveSubject.complete();

      // THEN
      expect(eventProductRatingService.create).toHaveBeenCalledWith(eventProductRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductRating>>();
      const eventProductRating = { id: 123 };
      jest.spyOn(eventProductRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventProductRatingService.update).toHaveBeenCalledWith(eventProductRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
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

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
