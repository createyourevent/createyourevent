jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChipsCollectionService } from '../service/chips-collection.service';
import { IChipsCollection, ChipsCollection } from '../chips-collection.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ChipsCollectionUpdateComponent } from './chips-collection-update.component';

describe('ChipsCollection Management Update Component', () => {
  let comp: ChipsCollectionUpdateComponent;
  let fixture: ComponentFixture<ChipsCollectionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chipsCollectionService: ChipsCollectionService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChipsCollectionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ChipsCollectionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChipsCollectionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chipsCollectionService = TestBed.inject(ChipsCollectionService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const chipsCollection: IChipsCollection = { id: 456 };
      const user: IUser = { id: 'cd71a3fe-8c6f-41d3-ac39-1ebbc4c73f37' };
      chipsCollection.user = user;

      const userCollection: IUser[] = [{ id: 'a78d1481-8f32-49c2-82b7-57d450309399' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chipsCollection });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chipsCollection: IChipsCollection = { id: 456 };
      const user: IUser = { id: '08bdab6a-b773-40f0-ad88-d070b0b6157b' };
      chipsCollection.user = user;

      activatedRoute.data = of({ chipsCollection });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chipsCollection));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsCollection>>();
      const chipsCollection = { id: 123 };
      jest.spyOn(chipsCollectionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsCollection });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chipsCollection }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chipsCollectionService.update).toHaveBeenCalledWith(chipsCollection);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsCollection>>();
      const chipsCollection = new ChipsCollection();
      jest.spyOn(chipsCollectionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsCollection });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chipsCollection }));
      saveSubject.complete();

      // THEN
      expect(chipsCollectionService.create).toHaveBeenCalledWith(chipsCollection);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsCollection>>();
      const chipsCollection = { id: 123 };
      jest.spyOn(chipsCollectionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsCollection });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chipsCollectionService.update).toHaveBeenCalledWith(chipsCollection);
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
