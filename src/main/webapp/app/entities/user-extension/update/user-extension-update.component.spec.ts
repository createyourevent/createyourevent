jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserExtensionService } from '../service/user-extension.service';
import { IUserExtension, UserExtension } from '../user-extension.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserExtensionUpdateComponent } from './user-extension-update.component';

describe('UserExtension Management Update Component', () => {
  let comp: UserExtensionUpdateComponent;
  let fixture: ComponentFixture<UserExtensionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userExtensionService: UserExtensionService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserExtensionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(UserExtensionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserExtensionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userExtensionService = TestBed.inject(UserExtensionService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userExtension: IUserExtension = { id: 456 };
      const user: IUser = { id: '8dcdd0d6-4e4f-4caa-bee5-31fba7f78587' };
      userExtension.user = user;

      const userCollection: IUser[] = [{ id: '274a874c-62c8-4202-a6a4-a6d68001b0e9' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userExtension });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userExtension: IUserExtension = { id: 456 };
      const user: IUser = { id: 'b9c0356a-e784-4259-a9d6-5882c7d8a697' };
      userExtension.user = user;

      activatedRoute.data = of({ userExtension });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userExtension));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserExtension>>();
      const userExtension = { id: 123 };
      jest.spyOn(userExtensionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtension });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtension }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userExtensionService.update).toHaveBeenCalledWith(userExtension);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserExtension>>();
      const userExtension = new UserExtension();
      jest.spyOn(userExtensionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtension });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtension }));
      saveSubject.complete();

      // THEN
      expect(userExtensionService.create).toHaveBeenCalledWith(userExtension);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserExtension>>();
      const userExtension = { id: 123 };
      jest.spyOn(userExtensionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtension });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userExtensionService.update).toHaveBeenCalledWith(userExtension);
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
