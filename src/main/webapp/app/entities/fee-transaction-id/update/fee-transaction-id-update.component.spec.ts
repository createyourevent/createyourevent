jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FeeTransactionIdService } from '../service/fee-transaction-id.service';
import { IFeeTransactionId, FeeTransactionId } from '../fee-transaction-id.model';

import { FeeTransactionIdUpdateComponent } from './fee-transaction-id-update.component';

describe('FeeTransactionId Management Update Component', () => {
  let comp: FeeTransactionIdUpdateComponent;
  let fixture: ComponentFixture<FeeTransactionIdUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feeTransactionIdService: FeeTransactionIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FeeTransactionIdUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FeeTransactionIdUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeeTransactionIdUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feeTransactionIdService = TestBed.inject(FeeTransactionIdService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const feeTransactionId: IFeeTransactionId = { id: 456 };

      activatedRoute.data = of({ feeTransactionId });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(feeTransactionId));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransactionId>>();
      const feeTransactionId = { id: 123 };
      jest.spyOn(feeTransactionIdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeTransactionId }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(feeTransactionIdService.update).toHaveBeenCalledWith(feeTransactionId);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransactionId>>();
      const feeTransactionId = new FeeTransactionId();
      jest.spyOn(feeTransactionIdService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeTransactionId }));
      saveSubject.complete();

      // THEN
      expect(feeTransactionIdService.create).toHaveBeenCalledWith(feeTransactionId);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransactionId>>();
      const feeTransactionId = { id: 123 };
      jest.spyOn(feeTransactionIdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransactionId });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feeTransactionIdService.update).toHaveBeenCalledWith(feeTransactionId);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
