jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ImageService } from '../service/image.service';
import { IImage, Image } from '../image.model';

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
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { ImageUpdateComponent } from './image-update.component';

describe('Image Management Update Component', () => {
  let comp: ImageUpdateComponent;
  let fixture: ComponentFixture<ImageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let imageService: ImageService;
  let userService: UserService;
  let productService: ProductService;
  let shopService: ShopService;
  let eventService: EventService;
  let createYourEventServiceService: CreateYourEventServiceService;
  let organizationService: OrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ImageUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ImageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ImageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    imageService = TestBed.inject(ImageService);
    userService = TestBed.inject(UserService);
    productService = TestBed.inject(ProductService);
    shopService = TestBed.inject(ShopService);
    eventService = TestBed.inject(EventService);
    createYourEventServiceService = TestBed.inject(CreateYourEventServiceService);
    organizationService = TestBed.inject(OrganizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const image: IImage = { id: 456 };
      const user: IUser = { id: 'a30631d0-3194-4708-9b36-7f169c1dbce9' };
      image.user = user;

      const userCollection: IUser[] = [{ id: 'a7a4df2a-eda3-41aa-8232-989e43a4028c' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const image: IImage = { id: 456 };
      const product: IProduct = { id: 82250 };
      image.product = product;

      const productCollection: IProduct[] = [{ id: 10852 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Shop query and add missing value', () => {
      const image: IImage = { id: 456 };
      const shop: IShop = { id: 14276 };
      image.shop = shop;

      const shopCollection: IShop[] = [{ id: 42666 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(shopCollection, ...additionalShops);
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const image: IImage = { id: 456 };
      const event: IEvent = { id: 20806 };
      image.event = event;

      const eventCollection: IEvent[] = [{ id: 76486 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CreateYourEventService query and add missing value', () => {
      const image: IImage = { id: 456 };
      const service: ICreateYourEventService = { id: 73355 };
      image.service = service;

      const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 84605 }];
      jest.spyOn(createYourEventServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: createYourEventServiceCollection })));
      const additionalCreateYourEventServices = [service];
      const expectedCollection: ICreateYourEventService[] = [...additionalCreateYourEventServices, ...createYourEventServiceCollection];
      jest.spyOn(createYourEventServiceService, 'addCreateYourEventServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(createYourEventServiceService.query).toHaveBeenCalled();
      expect(createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing).toHaveBeenCalledWith(
        createYourEventServiceCollection,
        ...additionalCreateYourEventServices
      );
      expect(comp.createYourEventServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Organization query and add missing value', () => {
      const image: IImage = { id: 456 };
      const organization: IOrganization = { id: 85134 };
      image.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 85707 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const image: IImage = { id: 456 };
      const user: IUser = { id: '8e0ab9e1-e09c-46d4-a507-6141f0571d9f' };
      image.user = user;
      const product: IProduct = { id: 55683 };
      image.product = product;
      const shop: IShop = { id: 40716 };
      image.shop = shop;
      const event: IEvent = { id: 55451 };
      image.event = event;
      const service: ICreateYourEventService = { id: 49910 };
      image.service = service;
      const organization: IOrganization = { id: 13244 };
      image.organization = organization;

      activatedRoute.data = of({ image });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(image));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.createYourEventServicesSharedCollection).toContain(service);
      expect(comp.organizationsSharedCollection).toContain(organization);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Image>>();
      const image = { id: 123 };
      jest.spyOn(imageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ image });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: image }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(imageService.update).toHaveBeenCalledWith(image);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Image>>();
      const image = new Image();
      jest.spyOn(imageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ image });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: image }));
      saveSubject.complete();

      // THEN
      expect(imageService.create).toHaveBeenCalledWith(image);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Image>>();
      const image = { id: 123 };
      jest.spyOn(imageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ image });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(imageService.update).toHaveBeenCalledWith(image);
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

    describe('trackOrganizationById', () => {
      it('Should return tracked Organization primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrganizationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
