jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CouponService } from '../service/coupon.service';
import { ICoupon, Coupon } from '../coupon.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { CouponUpdateComponent } from './coupon-update.component';

describe('Coupon Management Update Component', () => {
  let comp: CouponUpdateComponent;
  let fixture: ComponentFixture<CouponUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let couponService: CouponService;
  let userService: UserService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CouponUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(CouponUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CouponUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    couponService = TestBed.inject(CouponService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const coupon: ICoupon = { id: 456 };
      const user: IUser = { id: '82674fa2-f7c5-4546-8ffa-9bad0966a145' };
      coupon.user = user;

      const userCollection: IUser[] = [{ id: '0746f77e-395f-4c71-8761-d9ec24faf9d7' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const coupon: ICoupon = { id: 456 };
      const event: IEvent = { id: 16845 };
      coupon.event = event;

      const eventCollection: IEvent[] = [{ id: 41499 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const coupon: ICoupon = { id: 456 };
      const user: IUser = { id: '90e1a89a-6722-407e-bdf9-0508f6b6b5b0' };
      coupon.user = user;
      const event: IEvent = { id: 54051 };
      coupon.event = event;

      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(coupon));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.eventsSharedCollection).toContain(event);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Coupon>>();
      const coupon = { id: 123 };
      jest.spyOn(couponService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coupon }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(couponService.update).toHaveBeenCalledWith(coupon);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Coupon>>();
      const coupon = new Coupon();
      jest.spyOn(couponService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coupon }));
      saveSubject.complete();

      // THEN
      expect(couponService.create).toHaveBeenCalledWith(coupon);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Coupon>>();
      const coupon = { id: 123 };
      jest.spyOn(couponService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(couponService.update).toHaveBeenCalledWith(coupon);
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
  });
});
