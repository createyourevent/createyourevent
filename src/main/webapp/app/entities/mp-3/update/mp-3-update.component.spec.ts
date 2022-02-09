jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { Mp3Service } from '../service/mp-3.service';
import { IMp3, Mp3 } from '../mp-3.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';

import { Mp3UpdateComponent } from './mp-3-update.component';

describe('Mp3 Management Update Component', () => {
  let comp: Mp3UpdateComponent;
  let fixture: ComponentFixture<Mp3UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mp3Service: Mp3Service;
  let userService: UserService;
  let productService: ProductService;
  let shopService: ShopService;
  let eventService: EventService;
  let createYourEventServiceService: CreateYourEventServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Mp3UpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(Mp3UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Mp3UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mp3Service = TestBed.inject(Mp3Service);
    userService = TestBed.inject(UserService);
    productService = TestBed.inject(ProductService);
    shopService = TestBed.inject(ShopService);
    eventService = TestBed.inject(EventService);
    createYourEventServiceService = TestBed.inject(CreateYourEventServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const mp3: IMp3 = { id: 456 };
      const user: IUser = { id: 'b87fd385-abf7-46e7-ad2b-83bd81e4549c' };
      mp3.user = user;

      const userCollection: IUser[] = [{ id: 'e2b0e124-23dd-4f43-bfb2-4de70526cbb7' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const mp3: IMp3 = { id: 456 };
      const product: IProduct = { id: 68499 };
      mp3.product = product;

      const productCollection: IProduct[] = [{ id: 13115 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Shop query and add missing value', () => {
      const mp3: IMp3 = { id: 456 };
      const shop: IShop = { id: 17708 };
      mp3.shop = shop;

      const shopCollection: IShop[] = [{ id: 66834 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(shopCollection, ...additionalShops);
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const mp3: IMp3 = { id: 456 };
      const event: IEvent = { id: 37361 };
      mp3.event = event;

      const eventCollection: IEvent[] = [{ id: 17585 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CreateYourEventService query and add missing value', () => {
      const mp3: IMp3 = { id: 456 };
      const service: ICreateYourEventService = { id: 43859 };
      mp3.service = service;

      const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 36436 }];
      jest.spyOn(createYourEventServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: createYourEventServiceCollection })));
      const additionalCreateYourEventServices = [service];
      const expectedCollection: ICreateYourEventService[] = [...additionalCreateYourEventServices, ...createYourEventServiceCollection];
      jest.spyOn(createYourEventServiceService, 'addCreateYourEventServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      expect(createYourEventServiceService.query).toHaveBeenCalled();
      expect(createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing).toHaveBeenCalledWith(
        createYourEventServiceCollection,
        ...additionalCreateYourEventServices
      );
      expect(comp.createYourEventServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mp3: IMp3 = { id: 456 };
      const user: IUser = { id: 'c2cd503d-f953-4041-96b3-72fb43c7c499' };
      mp3.user = user;
      const product: IProduct = { id: 2378 };
      mp3.product = product;
      const shop: IShop = { id: 50987 };
      mp3.shop = shop;
      const event: IEvent = { id: 91844 };
      mp3.event = event;
      const service: ICreateYourEventService = { id: 2354 };
      mp3.service = service;

      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(mp3));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.createYourEventServicesSharedCollection).toContain(service);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mp3>>();
      const mp3 = { id: 123 };
      jest.spyOn(mp3Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mp3 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(mp3Service.update).toHaveBeenCalledWith(mp3);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mp3>>();
      const mp3 = new Mp3();
      jest.spyOn(mp3Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mp3 }));
      saveSubject.complete();

      // THEN
      expect(mp3Service.create).toHaveBeenCalledWith(mp3);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mp3>>();
      const mp3 = { id: 123 };
      jest.spyOn(mp3Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mp3 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mp3Service.update).toHaveBeenCalledWith(mp3);
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

    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
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

    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCreateYourEventServiceById', () => {
      it('Should return tracked CreateYourEventService primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCreateYourEventServiceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
