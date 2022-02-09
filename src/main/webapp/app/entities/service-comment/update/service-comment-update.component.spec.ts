jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServiceCommentService } from '../service/service-comment.service';
import { IServiceComment, ServiceComment } from '../service-comment.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ServiceCommentUpdateComponent } from './service-comment-update.component';

describe('ServiceComment Management Update Component', () => {
  let comp: ServiceCommentUpdateComponent;
  let fixture: ComponentFixture<ServiceCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceCommentService: ServiceCommentService;
  let createYourEventServiceService: CreateYourEventServiceService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceCommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ServiceCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceCommentService = TestBed.inject(ServiceCommentService);
    createYourEventServiceService = TestBed.inject(CreateYourEventServiceService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ServiceComment query and add missing value', () => {
      const serviceComment: IServiceComment = { id: 456 };
      const serviceComment: IServiceComment = { id: 22847 };
      serviceComment.serviceComment = serviceComment;

      const serviceCommentCollection: IServiceComment[] = [{ id: 71106 }];
      jest.spyOn(serviceCommentService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCommentCollection })));
      const additionalServiceComments = [serviceComment];
      const expectedCollection: IServiceComment[] = [...additionalServiceComments, ...serviceCommentCollection];
      jest.spyOn(serviceCommentService, 'addServiceCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceComment });
      comp.ngOnInit();

      expect(serviceCommentService.query).toHaveBeenCalled();
      expect(serviceCommentService.addServiceCommentToCollectionIfMissing).toHaveBeenCalledWith(
        serviceCommentCollection,
        ...additionalServiceComments
      );
      expect(comp.serviceCommentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CreateYourEventService query and add missing value', () => {
      const serviceComment: IServiceComment = { id: 456 };
      const createYourEventService: ICreateYourEventService = { id: 58515 };
      serviceComment.createYourEventService = createYourEventService;

      const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 2247 }];
      jest.spyOn(createYourEventServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: createYourEventServiceCollection })));
      const additionalCreateYourEventServices = [createYourEventService];
      const expectedCollection: ICreateYourEventService[] = [...additionalCreateYourEventServices, ...createYourEventServiceCollection];
      jest.spyOn(createYourEventServiceService, 'addCreateYourEventServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceComment });
      comp.ngOnInit();

      expect(createYourEventServiceService.query).toHaveBeenCalled();
      expect(createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing).toHaveBeenCalledWith(
        createYourEventServiceCollection,
        ...additionalCreateYourEventServices
      );
      expect(comp.createYourEventServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const serviceComment: IServiceComment = { id: 456 };
      const user: IUser = { id: 'db28b16a-cfab-48f4-b360-d844330a287e' };
      serviceComment.user = user;

      const userCollection: IUser[] = [{ id: 'c5f5e7a2-0368-44e2-b9da-e64bcd5cb22a' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serviceComment: IServiceComment = { id: 456 };
      const serviceComment: IServiceComment = { id: 71684 };
      serviceComment.serviceComment = serviceComment;
      const createYourEventService: ICreateYourEventService = { id: 66852 };
      serviceComment.createYourEventService = createYourEventService;
      const user: IUser = { id: 'ca8b36fa-8e69-4b9a-b1db-f62c950cedb8' };
      serviceComment.user = user;

      activatedRoute.data = of({ serviceComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(serviceComment));
      expect(comp.serviceCommentsSharedCollection).toContain(serviceComment);
      expect(comp.createYourEventServicesSharedCollection).toContain(createYourEventService);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceComment>>();
      const serviceComment = { id: 123 };
      jest.spyOn(serviceCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceCommentService.update).toHaveBeenCalledWith(serviceComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceComment>>();
      const serviceComment = new ServiceComment();
      jest.spyOn(serviceCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceComment }));
      saveSubject.complete();

      // THEN
      expect(serviceCommentService.create).toHaveBeenCalledWith(serviceComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceComment>>();
      const serviceComment = { id: 123 };
      jest.spyOn(serviceCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceCommentService.update).toHaveBeenCalledWith(serviceComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackServiceCommentById', () => {
      it('Should return tracked ServiceComment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackServiceCommentById(0, entity);
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

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
