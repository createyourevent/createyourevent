jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BondService } from '../service/bond.service';
import { IBond, Bond } from '../bond.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPointsExchange } from 'app/entities/points-exchange/points-exchange.model';
import { PointsExchangeService } from 'app/entities/points-exchange/service/points-exchange.service';

import { BondUpdateComponent } from './bond-update.component';

describe('Bond Management Update Component', () => {
  let comp: BondUpdateComponent;
  let fixture: ComponentFixture<BondUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bondService: BondService;
  let userService: UserService;
  let pointsExchangeService: PointsExchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BondUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(BondUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BondUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bondService = TestBed.inject(BondService);
    userService = TestBed.inject(UserService);
    pointsExchangeService = TestBed.inject(PointsExchangeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const bond: IBond = { id: 456 };
      const user: IUser = { id: '62bbffbe-a930-4909-b081-3cd37dbf9c94' };
      bond.user = user;

      const userCollection: IUser[] = [{ id: 'aa2b552f-3714-4ea2-a798-0f8aab49a0cd' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bond });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PointsExchange query and add missing value', () => {
      const bond: IBond = { id: 456 };
      const pointsExchange: IPointsExchange = { id: 26684 };
      bond.pointsExchange = pointsExchange;

      const pointsExchangeCollection: IPointsExchange[] = [{ id: 16055 }];
      jest.spyOn(pointsExchangeService, 'query').mockReturnValue(of(new HttpResponse({ body: pointsExchangeCollection })));
      const additionalPointsExchanges = [pointsExchange];
      const expectedCollection: IPointsExchange[] = [...additionalPointsExchanges, ...pointsExchangeCollection];
      jest.spyOn(pointsExchangeService, 'addPointsExchangeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bond });
      comp.ngOnInit();

      expect(pointsExchangeService.query).toHaveBeenCalled();
      expect(pointsExchangeService.addPointsExchangeToCollectionIfMissing).toHaveBeenCalledWith(
        pointsExchangeCollection,
        ...additionalPointsExchanges
      );
      expect(comp.pointsExchangesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bond: IBond = { id: 456 };
      const user: IUser = { id: 'f223f235-3f9a-4863-af56-aa52f7ffa4ea' };
      bond.user = user;
      const pointsExchange: IPointsExchange = { id: 64476 };
      bond.pointsExchange = pointsExchange;

      activatedRoute.data = of({ bond });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bond));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.pointsExchangesSharedCollection).toContain(pointsExchange);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bond>>();
      const bond = { id: 123 };
      jest.spyOn(bondService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bond });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bond }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bondService.update).toHaveBeenCalledWith(bond);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bond>>();
      const bond = new Bond();
      jest.spyOn(bondService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bond });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bond }));
      saveSubject.complete();

      // THEN
      expect(bondService.create).toHaveBeenCalledWith(bond);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bond>>();
      const bond = { id: 123 };
      jest.spyOn(bondService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bond });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bondService.update).toHaveBeenCalledWith(bond);
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

    describe('trackPointsExchangeById', () => {
      it('Should return tracked PointsExchange primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPointsExchangeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
