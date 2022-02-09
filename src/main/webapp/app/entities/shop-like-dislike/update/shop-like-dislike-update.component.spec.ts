jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ShopLikeDislikeService } from '../service/shop-like-dislike.service';
import { IShopLikeDislike, ShopLikeDislike } from '../shop-like-dislike.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ShopLikeDislikeUpdateComponent } from './shop-like-dislike-update.component';

describe('ShopLikeDislike Management Update Component', () => {
  let comp: ShopLikeDislikeUpdateComponent;
  let fixture: ComponentFixture<ShopLikeDislikeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shopLikeDislikeService: ShopLikeDislikeService;
  let shopService: ShopService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShopLikeDislikeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ShopLikeDislikeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShopLikeDislikeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shopLikeDislikeService = TestBed.inject(ShopLikeDislikeService);
    shopService = TestBed.inject(ShopService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shop query and add missing value', () => {
      const shopLikeDislike: IShopLikeDislike = { id: 456 };
      const shop: IShop = { id: 88154 };
      shopLikeDislike.shop = shop;

      const shopCollection: IShop[] = [{ id: 9269 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shopLikeDislike });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(shopCollection, ...additionalShops);
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const shopLikeDislike: IShopLikeDislike = { id: 456 };
      const user: IUser = { id: '1f334642-10d0-44a0-a354-c95e4ecc5339' };
      shopLikeDislike.user = user;

      const userCollection: IUser[] = [{ id: '82eaa967-9193-4a3b-90a9-ce811e90931b' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shopLikeDislike });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shopLikeDislike: IShopLikeDislike = { id: 456 };
      const shop: IShop = { id: 95524 };
      shopLikeDislike.shop = shop;
      const user: IUser = { id: '5a031263-bc19-4163-8515-d16ab51bdcc5' };
      shopLikeDislike.user = user;

      activatedRoute.data = of({ shopLikeDislike });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(shopLikeDislike));
      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopLikeDislike>>();
      const shopLikeDislike = { id: 123 };
      jest.spyOn(shopLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shopLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(shopLikeDislikeService.update).toHaveBeenCalledWith(shopLikeDislike);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopLikeDislike>>();
      const shopLikeDislike = new ShopLikeDislike();
      jest.spyOn(shopLikeDislikeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shopLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(shopLikeDislikeService.create).toHaveBeenCalledWith(shopLikeDislike);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopLikeDislike>>();
      const shopLikeDislike = { id: 123 };
      jest.spyOn(shopLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shopLikeDislikeService.update).toHaveBeenCalledWith(shopLikeDislike);
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
