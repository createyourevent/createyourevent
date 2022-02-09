jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductCommentService } from '../service/product-comment.service';
import { IProductComment, ProductComment } from '../product-comment.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ProductCommentUpdateComponent } from './product-comment-update.component';

describe('ProductComment Management Update Component', () => {
  let comp: ProductCommentUpdateComponent;
  let fixture: ComponentFixture<ProductCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productCommentService: ProductCommentService;
  let productService: ProductService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductCommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProductCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productCommentService = TestBed.inject(ProductCommentService);
    productService = TestBed.inject(ProductService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProductComment query and add missing value', () => {
      const productComment: IProductComment = { id: 456 };
      const productComment: IProductComment = { id: 16530 };
      productComment.productComment = productComment;

      const productCommentCollection: IProductComment[] = [{ id: 60835 }];
      jest.spyOn(productCommentService, 'query').mockReturnValue(of(new HttpResponse({ body: productCommentCollection })));
      const additionalProductComments = [productComment];
      const expectedCollection: IProductComment[] = [...additionalProductComments, ...productCommentCollection];
      jest.spyOn(productCommentService, 'addProductCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productComment });
      comp.ngOnInit();

      expect(productCommentService.query).toHaveBeenCalled();
      expect(productCommentService.addProductCommentToCollectionIfMissing).toHaveBeenCalledWith(
        productCommentCollection,
        ...additionalProductComments
      );
      expect(comp.productCommentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const productComment: IProductComment = { id: 456 };
      const product: IProduct = { id: 67268 };
      productComment.product = product;

      const productCollection: IProduct[] = [{ id: 83879 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productComment });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const productComment: IProductComment = { id: 456 };
      const user: IUser = { id: '46db8707-2048-4919-86f0-65d56fb3024d' };
      productComment.user = user;

      const userCollection: IUser[] = [{ id: 'fd0f6433-790d-4875-a719-0e4517943e10' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productComment: IProductComment = { id: 456 };
      const productComment: IProductComment = { id: 10456 };
      productComment.productComment = productComment;
      const product: IProduct = { id: 67119 };
      productComment.product = product;
      const user: IUser = { id: '20179075-4636-4fc6-83b4-5101cfaed67a' };
      productComment.user = user;

      activatedRoute.data = of({ productComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(productComment));
      expect(comp.productCommentsSharedCollection).toContain(productComment);
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductComment>>();
      const productComment = { id: 123 };
      jest.spyOn(productCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productCommentService.update).toHaveBeenCalledWith(productComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductComment>>();
      const productComment = new ProductComment();
      jest.spyOn(productCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productComment }));
      saveSubject.complete();

      // THEN
      expect(productCommentService.create).toHaveBeenCalledWith(productComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductComment>>();
      const productComment = { id: 123 };
      jest.spyOn(productCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productCommentService.update).toHaveBeenCalledWith(productComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductCommentById', () => {
      it('Should return tracked ProductComment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductCommentById(0, entity);
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

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
