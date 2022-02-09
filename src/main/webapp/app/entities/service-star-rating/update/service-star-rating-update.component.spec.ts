jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServiceStarRatingService } from '../service/service-star-rating.service';
import { IServiceStarRating, ServiceStarRating } from '../service-star-rating.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ServiceStarRatingUpdateComponent } from './service-star-rating-update.component';

describe('ServiceStarRating Management Update Component', () => {
  let comp: ServiceStarRatingUpdateComponent;
  let fixture: ComponentFixture<ServiceStarRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceStarRatingService: ServiceStarRatingService;
  let createYourEventServiceService: CreateYourEventServiceService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceStarRatingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ServiceStarRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceStarRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceStarRatingService = TestBed.inject(ServiceStarRatingService);
    createYourEventServiceService = TestBed.inject(CreateYourEventServiceService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CreateYourEventService query and add missing value', () => {
      const serviceStarRating: IServiceStarRating = { id: 456 };
      const service: ICreateYourEventService = { id: 93519 };
      serviceStarRating.service = service;

      const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 28248 }];
      jest.spyOn(createYourEventServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: createYourEventServiceCollection })));
      const additionalCreateYourEventServices = [service];
      const expectedCollection: ICreateYourEventService[] = [...additionalCreateYourEventServices, ...createYourEventServiceCollection];
      jest.spyOn(createYourEventServiceService, 'addCreateYourEventServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceStarRating });
      comp.ngOnInit();

      expect(createYourEventServiceService.query).toHaveBeenCalled();
      expect(createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing).toHaveBeenCalledWith(
        createYourEventServiceCollection,
        ...additionalCreateYourEventServices
      );
      expect(comp.createYourEventServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const serviceStarRating: IServiceStarRating = { id: 456 };
      const user: IUser = { id: '1f0f65e1-10fe-454b-8bd1-72a3065b93b8' };
      serviceStarRating.user = user;

      const userCollection: IUser[] = [{ id: 'd2909558-2117-47fa-a339-cb28565ccfc1' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceStarRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serviceStarRating: IServiceStarRating = { id: 456 };
      const service: ICreateYourEventService = { id: 90974 };
      serviceStarRating.service = service;
      const user: IUser = { id: 'db9563fb-792e-483a-854f-604579f3084c' };
      serviceStarRating.user = user;

      activatedRoute.data = of({ serviceStarRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(serviceStarRating));
      expect(comp.createYourEventServicesSharedCollection).toContain(service);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceStarRating>>();
      const serviceStarRating = { id: 123 };
      jest.spyOn(serviceStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceStarRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceStarRatingService.update).toHaveBeenCalledWith(serviceStarRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceStarRating>>();
      const serviceStarRating = new ServiceStarRating();
      jest.spyOn(serviceStarRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceStarRating }));
      saveSubject.complete();

      // THEN
      expect(serviceStarRatingService.create).toHaveBeenCalledWith(serviceStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceStarRating>>();
      const serviceStarRating = { id: 123 };
      jest.spyOn(serviceStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceStarRatingService.update).toHaveBeenCalledWith(serviceStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCreateYourEventServiceById', () => {
      it('Should return tracked CreateYourEventService primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCreateYourEventServiceById(0, entity);
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
