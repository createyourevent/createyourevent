jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FeeBalanceService } from '../service/fee-balance.service';
import { IFeeBalance, FeeBalance } from '../fee-balance.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FeeBalanceUpdateComponent } from './fee-balance-update.component';

describe('FeeBalance Management Update Component', () => {
  let comp: FeeBalanceUpdateComponent;
  let fixture: ComponentFixture<FeeBalanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feeBalanceService: FeeBalanceService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FeeBalanceUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FeeBalanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeeBalanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feeBalanceService = TestBed.inject(FeeBalanceService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const feeBalance: IFeeBalance = { id: 456 };
      const user: IUser = { id: '462c91fc-1475-43ff-b5d2-945259933a19' };
      feeBalance.user = user;

      const userCollection: IUser[] = [{ id: '569c6f38-dc07-49bd-8846-530818c5ca99' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeBalance });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const feeBalance: IFeeBalance = { id: 456 };
      const user: IUser = { id: '48775e50-dc9e-49aa-b223-9c3faa2004f1' };
      feeBalance.user = user;

      activatedRoute.data = of({ feeBalance });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(feeBalance));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeBalance>>();
      const feeBalance = { id: 123 };
      jest.spyOn(feeBalanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeBalance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeBalance }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(feeBalanceService.update).toHaveBeenCalledWith(feeBalance);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeBalance>>();
      const feeBalance = new FeeBalance();
      jest.spyOn(feeBalanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeBalance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeBalance }));
      saveSubject.complete();

      // THEN
      expect(feeBalanceService.create).toHaveBeenCalledWith(feeBalance);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeBalance>>();
      const feeBalance = { id: 123 };
      jest.spyOn(feeBalanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeBalance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feeBalanceService.update).toHaveBeenCalledWith(feeBalance);
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
