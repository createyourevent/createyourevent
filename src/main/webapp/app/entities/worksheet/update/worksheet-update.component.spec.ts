jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WorksheetService } from '../service/worksheet.service';
import { IWorksheet, Worksheet } from '../worksheet.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { WorksheetUpdateComponent } from './worksheet-update.component';

describe('Worksheet Management Update Component', () => {
  let comp: WorksheetUpdateComponent;
  let fixture: ComponentFixture<WorksheetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let worksheetService: WorksheetService;
  let userService: UserService;
  let eventService: EventService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WorksheetUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(WorksheetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorksheetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    worksheetService = TestBed.inject(WorksheetService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);
    productService = TestBed.inject(ProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const worksheet: IWorksheet = { id: 456 };
      const user: IUser = { id: '283653ac-3821-4a50-a9a0-27fc72a7c027' };
      worksheet.user = user;

      const userCollection: IUser[] = [{ id: '2af8ac11-1f34-460e-8e28-38eb6c8a0c79' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const worksheet: IWorksheet = { id: 456 };
      const event: IEvent = { id: 90327 };
      worksheet.event = event;

      const eventCollection: IEvent[] = [{ id: 38173 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const worksheet: IWorksheet = { id: 456 };
      const product: IProduct = { id: 47227 };
      worksheet.product = product;

      const productCollection: IProduct[] = [{ id: 24167 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const worksheet: IWorksheet = { id: 456 };
      const user: IUser = { id: '0511fdaf-4484-492e-a1a3-dbc21d2412a7' };
      worksheet.user = user;
      const event: IEvent = { id: 15194 };
      worksheet.event = event;
      const product: IProduct = { id: 34332 };
      worksheet.product = product;

      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(worksheet));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.productsSharedCollection).toContain(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Worksheet>>();
      const worksheet = { id: 123 };
      jest.spyOn(worksheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: worksheet }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(worksheetService.update).toHaveBeenCalledWith(worksheet);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Worksheet>>();
      const worksheet = new Worksheet();
      jest.spyOn(worksheetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: worksheet }));
      saveSubject.complete();

      // THEN
      expect(worksheetService.create).toHaveBeenCalledWith(worksheet);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Worksheet>>();
      const worksheet = { id: 123 };
      jest.spyOn(worksheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ worksheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(worksheetService.update).toHaveBeenCalledWith(worksheet);
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
  });
});
