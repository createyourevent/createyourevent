jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ShopCommentService } from '../service/shop-comment.service';
import { IShopComment, ShopComment } from '../shop-comment.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ShopCommentUpdateComponent } from './shop-comment-update.component';

describe('ShopComment Management Update Component', () => {
  let comp: ShopCommentUpdateComponent;
  let fixture: ComponentFixture<ShopCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shopCommentService: ShopCommentService;
  let shopService: ShopService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShopCommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ShopCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShopCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shopCommentService = TestBed.inject(ShopCommentService);
    shopService = TestBed.inject(ShopService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ShopComment query and add missing value', () => {
      const shopComment: IShopComment = { id: 456 };
      const shopComment: IShopComment = { id: 11573 };
      shopComment.shopComment = shopComment;

      const shopCommentCollection: IShopComment[] = [{ id: 73307 }];
      jest.spyOn(shopCommentService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCommentCollection })));
      const additionalShopComments = [shopComment];
      const expectedCollection: IShopComment[] = [...additionalShopComments, ...shopCommentCollection];
      jest.spyOn(shopCommentService, 'addShopCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shopComment });
      comp.ngOnInit();

      expect(shopCommentService.query).toHaveBeenCalled();
      expect(shopCommentService.addShopCommentToCollectionIfMissing).toHaveBeenCalledWith(shopCommentCollection, ...additionalShopComments);
      expect(comp.shopCommentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Shop query and add missing value', () => {
      const shopComment: IShopComment = { id: 456 };
      const shop: IShop = { id: 92992 };
      shopComment.shop = shop;

      const shopCollection: IShop[] = [{ id: 32860 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shopComment });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(shopCollection, ...additionalShops);
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const shopComment: IShopComment = { id: 456 };
      const user: IUser = { id: 'f628f6a0-b661-4366-bac2-ad5e9f7855d1' };
      shopComment.user = user;

      const userCollection: IUser[] = [{ id: 'a9833a4c-7963-49ff-91d2-5b1ba43a45b2' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shopComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shopComment: IShopComment = { id: 456 };
      const shopComment: IShopComment = { id: 55217 };
      shopComment.shopComment = shopComment;
      const shop: IShop = { id: 31276 };
      shopComment.shop = shop;
      const user: IUser = { id: 'c38ea224-91d1-490f-97ff-5ecfa4063d03' };
      shopComment.user = user;

      activatedRoute.data = of({ shopComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(shopComment));
      expect(comp.shopCommentsSharedCollection).toContain(shopComment);
      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopComment>>();
      const shopComment = { id: 123 };
      jest.spyOn(shopCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shopComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(shopCommentService.update).toHaveBeenCalledWith(shopComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopComment>>();
      const shopComment = new ShopComment();
      jest.spyOn(shopCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shopComment }));
      saveSubject.complete();

      // THEN
      expect(shopCommentService.create).toHaveBeenCalledWith(shopComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShopComment>>();
      const shopComment = { id: 123 };
      jest.spyOn(shopCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shopComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shopCommentService.update).toHaveBeenCalledWith(shopComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackShopCommentById', () => {
      it('Should return tracked ShopComment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackShopCommentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

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
