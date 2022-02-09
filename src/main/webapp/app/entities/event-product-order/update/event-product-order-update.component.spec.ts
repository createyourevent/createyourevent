jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventProductOrderService } from '../service/event-product-order.service';
import { IEventProductOrder, EventProductOrder } from '../event-product-order.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from 'app/entities/cart/service/cart.service';
import { IDeliveryType } from 'app/entities/delivery-type/delivery-type.model';
import { DeliveryTypeService } from 'app/entities/delivery-type/service/delivery-type.service';

import { EventProductOrderUpdateComponent } from './event-product-order-update.component';

describe('EventProductOrder Management Update Component', () => {
  let comp: EventProductOrderUpdateComponent;
  let fixture: ComponentFixture<EventProductOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventProductOrderService: EventProductOrderService;
  let userService: UserService;
  let eventService: EventService;
  let productService: ProductService;
  let shopService: ShopService;
  let cartService: CartService;
  let deliveryTypeService: DeliveryTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventProductOrderUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventProductOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventProductOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventProductOrderService = TestBed.inject(EventProductOrderService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);
    productService = TestBed.inject(ProductService);
    shopService = TestBed.inject(ShopService);
    cartService = TestBed.inject(CartService);
    deliveryTypeService = TestBed.inject(DeliveryTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const eventProductOrder: IEventProductOrder = { id: 456 };
      const user: IUser = { id: 'd250948b-3caf-47fa-82e1-d25eeb0b2523' };
      eventProductOrder.user = user;

      const userCollection: IUser[] = [{ id: 'e7cf1468-a99a-4f8e-90ee-d3f4a9c06458' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const eventProductOrder: IEventProductOrder = { id: 456 };
      const event: IEvent = { id: 2848 };
      eventProductOrder.event = event;

      const eventCollection: IEvent[] = [{ id: 99354 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const eventProductOrder: IEventProductOrder = { id: 456 };
      const product: IProduct = { id: 42155 };
      eventProductOrder.product = product;

      const productCollection: IProduct[] = [{ id: 50938 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Shop query and add missing value', () => {
      const eventProductOrder: IEventProductOrder = { id: 456 };
      const shop: IShop = { id: 53094 };
      eventProductOrder.shop = shop;

      const shopCollection: IShop[] = [{ id: 28071 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(shopCollection, ...additionalShops);
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cart query and add missing value', () => {
      const eventProductOrder: IEventProductOrder = { id: 456 };
      const cart: ICart = { id: 59735 };
      eventProductOrder.cart = cart;

      const cartCollection: ICart[] = [{ id: 20470 }];
      jest.spyOn(cartService, 'query').mockReturnValue(of(new HttpResponse({ body: cartCollection })));
      const additionalCarts = [cart];
      const expectedCollection: ICart[] = [...additionalCarts, ...cartCollection];
      jest.spyOn(cartService, 'addCartToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      expect(cartService.query).toHaveBeenCalled();
      expect(cartService.addCartToCollectionIfMissing).toHaveBeenCalledWith(cartCollection, ...additionalCarts);
      expect(comp.cartsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DeliveryType query and add missing value', () => {
      const eventProductOrder: IEventProductOrder = { id: 456 };
      const deliveryType: IDeliveryType = { id: 89590 };
      eventProductOrder.deliveryType = deliveryType;

      const deliveryTypeCollection: IDeliveryType[] = [{ id: 83774 }];
      jest.spyOn(deliveryTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: deliveryTypeCollection })));
      const additionalDeliveryTypes = [deliveryType];
      const expectedCollection: IDeliveryType[] = [...additionalDeliveryTypes, ...deliveryTypeCollection];
      jest.spyOn(deliveryTypeService, 'addDeliveryTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      expect(deliveryTypeService.query).toHaveBeenCalled();
      expect(deliveryTypeService.addDeliveryTypeToCollectionIfMissing).toHaveBeenCalledWith(
        deliveryTypeCollection,
        ...additionalDeliveryTypes
      );
      expect(comp.deliveryTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventProductOrder: IEventProductOrder = { id: 456 };
      const user: IUser = { id: '0cec6998-98e5-4fe6-b648-a9252f5f8bc8' };
      eventProductOrder.user = user;
      const event: IEvent = { id: 6269 };
      eventProductOrder.event = event;
      const product: IProduct = { id: 15013 };
      eventProductOrder.product = product;
      const shop: IShop = { id: 58084 };
      eventProductOrder.shop = shop;
      const cart: ICart = { id: 2538 };
      eventProductOrder.cart = cart;
      const deliveryType: IDeliveryType = { id: 23685 };
      eventProductOrder.deliveryType = deliveryType;

      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventProductOrder));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.cartsSharedCollection).toContain(cart);
      expect(comp.deliveryTypesSharedCollection).toContain(deliveryType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductOrder>>();
      const eventProductOrder = { id: 123 };
      jest.spyOn(eventProductOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventProductOrder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventProductOrderService.update).toHaveBeenCalledWith(eventProductOrder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductOrder>>();
      const eventProductOrder = new EventProductOrder();
      jest.spyOn(eventProductOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventProductOrder }));
      saveSubject.complete();

      // THEN
      expect(eventProductOrderService.create).toHaveBeenCalledWith(eventProductOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventProductOrder>>();
      const eventProductOrder = { id: 123 };
      jest.spyOn(eventProductOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventProductOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventProductOrderService.update).toHaveBeenCalledWith(eventProductOrder);
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

    describe('trackCartById', () => {
      it('Should return tracked Cart primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCartById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDeliveryTypeById', () => {
      it('Should return tracked DeliveryType primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDeliveryTypeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
