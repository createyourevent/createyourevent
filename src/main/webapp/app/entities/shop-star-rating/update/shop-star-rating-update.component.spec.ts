jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ShopStarRatingService } from '../service/shop-star-rating.service';
import { IShopStarRating, ShopStarRating } from '../shop-star-rating.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ShopStarRatingUpdateComponent } from './shop-star-rating-update.component';

describe('ShopStarRating Management Update Component', () => {
  let comp: ShopStarRatingUpdateComponent;
  let fixture: ComponentFixture<ShopStarRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shopStarRatingService: ShopStarRatingService;
  let shopService: ShopService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShopStarRatingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ShopStarRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShopStarRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shopStarRatingService = TestBed.inject(ShopStarRatingService);
    shopService = TestBed.inject(ShopService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shop query and add missing value', () => {
      const shopStarRating: IShopStarRating = { id: 456 };
      const shop: IShop = { id: 99495 };
      shopStarRating.shop = shop;

      const shopCollection: IShop[] = [{ id: 11269 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shopStarRating });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(shopCollection, ...additionalShops);
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const shopStarRating: IShopStarRating = { id: 456 };
      const user: IUser = { id: 'ec4bb6d7-14c7-4f1e-8982-a5ef4283dae4' };
      shopStarRating.user = user;

      const userCollection: IUser[] = [{ id: '89fe8a17-0508-4057-92cb-76cf04d45a9b' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shopStarRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shopStarRating: IShopStarRating = { id: 456 };
      const shop: IShop = { id: 10513 };
      shopStarRating.shop = shop;
      const user: IUser = { id: 'ec5244ba-c467-4b34-9077-96a62935eb73' };
      shopStarRating.user = user;

      activatedRoute.data = of({ shopStarRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(shopStarRating));
      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopStarRating>>();
      const shopStarRating = { id: 123 };
      jest.spyOn(shopStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shopStarRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(shopStarRatingService.update).toHaveBeenCalledWith(shopStarRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopStarRating>>();
      const shopStarRating = new ShopStarRating();
      jest.spyOn(shopStarRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shopStarRating }));
      saveSubject.complete();

      // THEN
      expect(shopStarRatingService.create).toHaveBeenCalledWith(shopStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopStarRating>>();
      const shopStarRating = { id: 123 };
      jest.spyOn(shopStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shopStarRatingService.update).toHaveBeenCalledWith(shopStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackShopById', () => {
      it('Should return tracked Shop primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackShopById(0, entity);
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
