jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductLikeDislikeService } from '../service/product-like-dislike.service';
import { IProductLikeDislike, ProductLikeDislike } from '../product-like-dislike.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ProductLikeDislikeUpdateComponent } from './product-like-dislike-update.component';

describe('ProductLikeDislike Management Update Component', () => {
  let comp: ProductLikeDislikeUpdateComponent;
  let fixture: ComponentFixture<ProductLikeDislikeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productLikeDislikeService: ProductLikeDislikeService;
  let productService: ProductService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductLikeDislikeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProductLikeDislikeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductLikeDislikeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productLikeDislikeService = TestBed.inject(ProductLikeDislikeService);
    productService = TestBed.inject(ProductService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const productLikeDislike: IProductLikeDislike = { id: 456 };
      const product: IProduct = { id: 30764 };
      productLikeDislike.product = product;

      const productCollection: IProduct[] = [{ id: 93347 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productLikeDislike });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const productLikeDislike: IProductLikeDislike = { id: 456 };
      const user: IUser = { id: 'd5c2ceb5-cf46-4f15-8574-cc5157b488b0' };
      productLikeDislike.user = user;

      const userCollection: IUser[] = [{ id: '759568d4-4c13-4790-b6e3-13b6c4f40e4c' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productLikeDislike });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productLikeDislike: IProductLikeDislike = { id: 456 };
      const product: IProduct = { id: 7801 };
      productLikeDislike.product = product;
      const user: IUser = { id: 'f9f5bd01-99f8-4b02-bf28-4203d6708148' };
      productLikeDislike.user = user;

      activatedRoute.data = of({ productLikeDislike });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(productLikeDislike));
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductLikeDislike>>();
      const productLikeDislike = { id: 123 };
      jest.spyOn(productLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productLikeDislikeService.update).toHaveBeenCalledWith(productLikeDislike);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductLikeDislike>>();
      const productLikeDislike = new ProductLikeDislike();
      jest.spyOn(productLikeDislikeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(productLikeDislikeService.create).toHaveBeenCalledWith(productLikeDislike);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductLikeDislike>>();
      const productLikeDislike = { id: 123 };
      jest.spyOn(productLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productLikeDislikeService.update).toHaveBeenCalledWith(productLikeDislike);
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

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
