jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GiftShoppingCartService } from '../service/gift-shopping-cart.service';
import { IGiftShoppingCart, GiftShoppingCart } from '../gift-shopping-cart.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGift } from 'app/entities/gift/gift.model';
import { GiftService } from 'app/entities/gift/service/gift.service';

import { GiftShoppingCartUpdateComponent } from './gift-shopping-cart-update.component';

describe('GiftShoppingCart Management Update Component', () => {
  let comp: GiftShoppingCartUpdateComponent;
  let fixture: ComponentFixture<GiftShoppingCartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let giftShoppingCartService: GiftShoppingCartService;
  let userService: UserService;
  let giftService: GiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GiftShoppingCartUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(GiftShoppingCartUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GiftShoppingCartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    giftShoppingCartService = TestBed.inject(GiftShoppingCartService);
    userService = TestBed.inject(UserService);
    giftService = TestBed.inject(GiftService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const giftShoppingCart: IGiftShoppingCart = { id: 456 };
      const user: IUser = { id: '12e014ab-412a-4160-853b-5b8102785ded' };
      giftShoppingCart.user = user;

      const userCollection: IUser[] = [{ id: 'b0fcf377-3c7e-4719-b636-5606a354d47a' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ giftShoppingCart });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Gift query and add missing value', () => {
      const giftShoppingCart: IGiftShoppingCart = { id: 456 };
      const gift: IGift = { id: 95438 };
      giftShoppingCart.gift = gift;

      const giftCollection: IGift[] = [{ id: 50669 }];
      jest.spyOn(giftService, 'query').mockReturnValue(of(new HttpResponse({ body: giftCollection })));
      const additionalGifts = [gift];
      const expectedCollection: IGift[] = [...additionalGifts, ...giftCollection];
      jest.spyOn(giftService, 'addGiftToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ giftShoppingCart });
      comp.ngOnInit();

      expect(giftService.query).toHaveBeenCalled();
      expect(giftService.addGiftToCollectionIfMissing).toHaveBeenCalledWith(giftCollection, ...additionalGifts);
      expect(comp.giftsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const giftShoppingCart: IGiftShoppingCart = { id: 456 };
      const user: IUser = { id: 'bbeb0d47-ddf4-47cd-a4ba-eab4e6684a9d' };
      giftShoppingCart.user = user;
      const gift: IGift = { id: 42584 };
      giftShoppingCart.gift = gift;

      activatedRoute.data = of({ giftShoppingCart });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(giftShoppingCart));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.giftsSharedCollection).toContain(gift);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GiftShoppingCart>>();
      const giftShoppingCart = { id: 123 };
      jest.spyOn(giftShoppingCartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ giftShoppingCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: giftShoppingCart }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(giftShoppingCartService.update).toHaveBeenCalledWith(giftShoppingCart);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GiftShoppingCart>>();
      const giftShoppingCart = new GiftShoppingCart();
      jest.spyOn(giftShoppingCartService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ giftShoppingCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: giftShoppingCart }));
      saveSubject.complete();

      // THEN
      expect(giftShoppingCartService.create).toHaveBeenCalledWith(giftShoppingCart);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GiftShoppingCart>>();
      const giftShoppingCart = { id: 123 };
      jest.spyOn(giftShoppingCartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ giftShoppingCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(giftShoppingCartService.update).toHaveBeenCalledWith(giftShoppingCart);
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

    describe('trackGiftById', () => {
      it('Should return tracked Gift primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackGiftById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
