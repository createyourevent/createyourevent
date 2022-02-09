jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServiceLikeDislikeService } from '../service/service-like-dislike.service';
import { IServiceLikeDislike, ServiceLikeDislike } from '../service-like-dislike.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ServiceLikeDislikeUpdateComponent } from './service-like-dislike-update.component';

describe('ServiceLikeDislike Management Update Component', () => {
  let comp: ServiceLikeDislikeUpdateComponent;
  let fixture: ComponentFixture<ServiceLikeDislikeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceLikeDislikeService: ServiceLikeDislikeService;
  let createYourEventServiceService: CreateYourEventServiceService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceLikeDislikeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ServiceLikeDislikeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceLikeDislikeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceLikeDislikeService = TestBed.inject(ServiceLikeDislikeService);
    createYourEventServiceService = TestBed.inject(CreateYourEventServiceService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CreateYourEventService query and add missing value', () => {
      const serviceLikeDislike: IServiceLikeDislike = { id: 456 };
      const createYourEventService: ICreateYourEventService = { id: 4232 };
      serviceLikeDislike.createYourEventService = createYourEventService;

      const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 90619 }];
      jest.spyOn(createYourEventServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: createYourEventServiceCollection })));
      const additionalCreateYourEventServices = [createYourEventService];
      const expectedCollection: ICreateYourEventService[] = [...additionalCreateYourEventServices, ...createYourEventServiceCollection];
      jest.spyOn(createYourEventServiceService, 'addCreateYourEventServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceLikeDislike });
      comp.ngOnInit();

      expect(createYourEventServiceService.query).toHaveBeenCalled();
      expect(createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing).toHaveBeenCalledWith(
        createYourEventServiceCollection,
        ...additionalCreateYourEventServices
      );
      expect(comp.createYourEventServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const serviceLikeDislike: IServiceLikeDislike = { id: 456 };
      const user: IUser = { id: 'c998f08f-34f4-4015-be28-8fa251a5628a' };
      serviceLikeDislike.user = user;

      const userCollection: IUser[] = [{ id: '1420ef83-8bc2-401e-8bb3-772f1a554711' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceLikeDislike });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serviceLikeDislike: IServiceLikeDislike = { id: 456 };
      const createYourEventService: ICreateYourEventService = { id: 63063 };
      serviceLikeDislike.createYourEventService = createYourEventService;
      const user: IUser = { id: '6ddbffea-246f-454a-852a-4515bd6268f5' };
      serviceLikeDislike.user = user;

      activatedRoute.data = of({ serviceLikeDislike });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(serviceLikeDislike));
      expect(comp.createYourEventServicesSharedCollection).toContain(createYourEventService);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceLikeDislike>>();
      const serviceLikeDislike = { id: 123 };
      jest.spyOn(serviceLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceLikeDislikeService.update).toHaveBeenCalledWith(serviceLikeDislike);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceLikeDislike>>();
      const serviceLikeDislike = new ServiceLikeDislike();
      jest.spyOn(serviceLikeDislikeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(serviceLikeDislikeService.create).toHaveBeenCalledWith(serviceLikeDislike);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceLikeDislike>>();
      const serviceLikeDislike = { id: 123 };
      jest.spyOn(serviceLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceLikeDislikeService.update).toHaveBeenCalledWith(serviceLikeDislike);
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
