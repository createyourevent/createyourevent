jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CreateYourEventServiceService } from '../service/create-your-event-service.service';
import { ICreateYourEventService, CreateYourEventService } from '../create-your-event-service.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { CreateYourEventServiceUpdateComponent } from './create-your-event-service-update.component';

describe('CreateYourEventService Management Update Component', () => {
  let comp: CreateYourEventServiceUpdateComponent;
  let fixture: ComponentFixture<CreateYourEventServiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let createYourEventServiceService: CreateYourEventServiceService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CreateYourEventServiceUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(CreateYourEventServiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreateYourEventServiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    createYourEventServiceService = TestBed.inject(CreateYourEventServiceService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const createYourEventService: ICreateYourEventService = { id: 456 };
      const user: IUser = { id: '6ffd6d8b-9ce6-43e9-ac32-b7ce1c462421' };
      createYourEventService.user = user;

      const userCollection: IUser[] = [{ id: '2c43cbda-ae69-4183-ba37-d417859c9bf4' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ createYourEventService });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const createYourEventService: ICreateYourEventService = { id: 456 };
      const user: IUser = { id: 'd9f7ae8b-e97d-444f-bf83-423458200689' };
      createYourEventService.user = user;

      activatedRoute.data = of({ createYourEventService });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(createYourEventService));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreateYourEventService>>();
      const createYourEventService = { id: 123 };
      jest.spyOn(createYourEventServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ createYourEventService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: createYourEventService }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(createYourEventServiceService.update).toHaveBeenCalledWith(createYourEventService);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreateYourEventService>>();
      const createYourEventService = new CreateYourEventService();
      jest.spyOn(createYourEventServiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ createYourEventService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: createYourEventService }));
      saveSubject.complete();

      // THEN
      expect(createYourEventServiceService.create).toHaveBeenCalledWith(createYourEventService);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreateYourEventService>>();
      const createYourEventService = { id: 123 };
      jest.spyOn(createYourEventServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ createYourEventService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(createYourEventServiceService.update).toHaveBeenCalledWith(createYourEventService);
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
  });
});
