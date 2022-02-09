jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReservationTransactionIdService } from '../service/reservation-transaction-id.service';
import { IReservationTransactionId, ReservationTransactionId } from '../reservation-transaction-id.model';

import { ReservationTransactionIdUpdateComponent } from './reservation-transaction-id-update.component';

describe('ReservationTransactionId Management Update Component', () => {
  let comp: ReservationTransactionIdUpdateComponent;
  let fixture: ComponentFixture<ReservationTransactionIdUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reservationTransactionIdService: ReservationTransactionIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ReservationTransactionIdUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ReservationTransactionIdUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReservationTransactionIdUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reservationTransactionIdService = TestBed.inject(ReservationTransactionIdService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const reservationTransactionId: IReservationTransactionId = { id: 456 };

      activatedRoute.data = of({ reservationTransactionId });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(reservationTransactionId));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ReservationTransactionId>>();
      const reservationTransactionId = { id: 123 };
      jest.spyOn(reservationTransactionIdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservationTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reservationTransactionId }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(reservationTransactionIdService.update).toHaveBeenCalledWith(reservationTransactionId);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ReservationTransactionId>>();
      const reservationTransactionId = new ReservationTransactionId();
      jest.spyOn(reservationTransactionIdService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservationTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reservationTransactionId }));
      saveSubject.complete();

      // THEN
      expect(reservationTransactionIdService.create).toHaveBeenCalledWith(reservationTransactionId);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ReservationTransactionId>>();
      const reservationTransactionId = { id: 123 };
      jest.spyOn(reservationTransactionIdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservationTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reservationTransactionIdService.update).toHaveBeenCalledWith(reservationTransactionId);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
