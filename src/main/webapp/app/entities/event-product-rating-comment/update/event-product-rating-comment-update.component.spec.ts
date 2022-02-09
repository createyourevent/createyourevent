jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventProductRatingCommentService } from '../service/event-product-rating-comment.service';
import { IEventProductRatingComment, EventProductRatingComment } from '../event-product-rating-comment.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { EventProductRatingCommentUpdateComponent } from './event-product-rating-comment-update.component';

describe('EventProductRatingComment Management Update Component', () => {
  let comp: EventProductRatingCommentUpdateComponent;
  let fixture: ComponentFixture<EventProductRatingCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventProductRatingCommentService: EventProductRatingCommentService;
  let userService: UserService;
  let eventService: EventService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventProductRatingCommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventProductRatingCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventProductRatingCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventProductRatingCommentService = TestBed.inject(EventProductRatingCommentService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);
    productService = TestBed.inject(ProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const eventProductRatingComment: IEventProductRatingComment = { id: 456 };
      const user: IUser = { id: '3a45d738-2ede-4e0b-bd39-ee8710336708' };
      eventProductRatingComment.user = user;

      const userCollection: IUser[] = [{ id: '196336d8-22ac-4f29-86c3-3621a1cbbd2f' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductRatingComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const eventProductRatingComment: IEventProductRatingComment = { id: 456 };
      const event: IEvent = { id: 80268 };
      eventProductRatingComment.event = event;

      const eventCollection: IEvent[] = [{ id: 98677 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductRatingComment });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const eventProductRatingComment: IEventProductRatingComment = { id: 456 };
      const product: IProduct = { id: 87289 };
      eventProductRatingComment.product = product;

      const productCollection: IProduct[] = [{ id: 33867 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductRatingComment });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventProductRatingComment: IEventProductRatingComment = { id: 456 };
      const user: IUser = { id: 'a3382351-28a1-4543-af5f-99fcb0e2814f' };
      eventProductRatingComment.user = user;
      const event: IEvent = { id: 44484 };
      eventProductRatingComment.event = event;
      const product: IProduct = { id: 30771 };
      eventProductRatingComment.product = product;

      activatedRoute.data = of({ eventProductRatingComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventProductRatingComment));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.productsSharedCollection).toContain(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductRatingComment>>();
      const eventProductRatingComment = { id: 123 };
      jest.spyOn(eventProductRatingCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductRatingComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventProductRatingComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventProductRatingCommentService.update).toHaveBeenCalledWith(eventProductRatingComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductRatingComment>>();
      const eventProductRatingComment = new EventProductRatingComment();
      jest.spyOn(eventProductRatingCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductRatingComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventProductRatingComment }));
      saveSubject.complete();

      // THEN
      expect(eventProductRatingCommentService.create).toHaveBeenCalledWith(eventProductRatingComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductRatingComment>>();
      const eventProductRatingComment = { id: 123 };
      jest.spyOn(eventProductRatingCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductRatingComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventProductRatingCommentService.update).toHaveBeenCalledWith(eventProductRatingComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
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

    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
