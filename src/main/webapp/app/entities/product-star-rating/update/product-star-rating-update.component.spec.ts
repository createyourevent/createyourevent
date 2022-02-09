jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductStarRatingService } from '../service/product-star-rating.service';
import { IProductStarRating, ProductStarRating } from '../product-star-rating.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ProductStarRatingUpdateComponent } from './product-star-rating-update.component';

describe('ProductStarRating Management Update Component', () => {
  let comp: ProductStarRatingUpdateComponent;
  let fixture: ComponentFixture<ProductStarRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productStarRatingService: ProductStarRatingService;
  let productService: ProductService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductStarRatingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProductStarRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductStarRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productStarRatingService = TestBed.inject(ProductStarRatingService);
    productService = TestBed.inject(ProductService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const productStarRating: IProductStarRating = { id: 456 };
      const product: IProduct = { id: 95058 };
      productStarRating.product = product;

      const productCollection: IProduct[] = [{ id: 13172 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productStarRating });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const productStarRating: IProductStarRating = { id: 456 };
      const user: IUser = { id: 'adbcb8bd-1734-4da5-a9df-9e58efba9bfb' };
      productStarRating.user = user;

      const userCollection: IUser[] = [{ id: '233eeb92-80d8-4c97-94de-335e9657ecd0' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productStarRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productStarRating: IProductStarRating = { id: 456 };
      const product: IProduct = { id: 44363 };
      productStarRating.product = product;
      const user: IUser = { id: 'f3af1b81-ea0a-40ba-b680-ada0985be5e9' };
      productStarRating.user = user;

      activatedRoute.data = of({ productStarRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(productStarRating));
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductStarRating>>();
      const productStarRating = { id: 123 };
      jest.spyOn(productStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productStarRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productStarRatingService.update).toHaveBeenCalledWith(productStarRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductStarRating>>();
      const productStarRating = new ProductStarRating();
      jest.spyOn(productStarRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productStarRating }));
      saveSubject.complete();

      // THEN
      expect(productStarRatingService.create).toHaveBeenCalledWith(productStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductStarRating>>();
      const productStarRating = { id: 123 };
      jest.spyOn(productStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productStarRatingService.update).toHaveBeenCalledWith(productStarRating);
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
