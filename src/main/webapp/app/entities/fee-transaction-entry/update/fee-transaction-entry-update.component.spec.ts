jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FeeTransactionEntryService } from '../service/fee-transaction-entry.service';
import { IFeeTransactionEntry, FeeTransactionEntry } from '../fee-transaction-entry.model';
import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { FeeTransactionService } from 'app/entities/fee-transaction/service/fee-transaction.service';

import { FeeTransactionEntryUpdateComponent } from './fee-transaction-entry-update.component';

describe('FeeTransactionEntry Management Update Component', () => {
  let comp: FeeTransactionEntryUpdateComponent;
  let fixture: ComponentFixture<FeeTransactionEntryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feeTransactionEntryService: FeeTransactionEntryService;
  let feeTransactionService: FeeTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FeeTransactionEntryUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FeeTransactionEntryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeeTransactionEntryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feeTransactionEntryService = TestBed.inject(FeeTransactionEntryService);
    feeTransactionService = TestBed.inject(FeeTransactionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FeeTransaction query and add missing value', () => {
      const feeTransactionEntry: IFeeTransactionEntry = { id: 456 };
      const feeTransaction: IFeeTransaction = { id: 14598 };
      feeTransactionEntry.feeTransaction = feeTransaction;

      const feeTransactionCollection: IFeeTransaction[] = [{ id: 14320 }];
      jest.spyOn(feeTransactionService, 'query').mockReturnValue(of(new HttpResponse({ body: feeTransactionCollection })));
      const additionalFeeTransactions = [feeTransaction];
      const expectedCollection: IFeeTransaction[] = [...additionalFeeTransactions, ...feeTransactionCollection];
      jest.spyOn(feeTransactionService, 'addFeeTransactionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feeTransactionEntry });
      comp.ngOnInit();

      expect(feeTransactionService.query).toHaveBeenCalled();
      expect(feeTransactionService.addFeeTransactionToCollectionIfMissing).toHaveBeenCalledWith(
        feeTransactionCollection,
        ...additionalFeeTransactions
      );
      expect(comp.feeTransactionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const feeTransactionEntry: IFeeTransactionEntry = { id: 456 };
      const feeTransaction: IFeeTransaction = { id: 20711 };
      feeTransactionEntry.feeTransaction = feeTransaction;

      activatedRoute.data = of({ feeTransactionEntry });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(feeTransactionEntry));
      expect(comp.feeTransactionsSharedCollection).toContain(feeTransaction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransactionEntry>>();
      const feeTransactionEntry = { id: 123 };
      jest.spyOn(feeTransactionEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransactionEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeTransactionEntry }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(feeTransactionEntryService.update).toHaveBeenCalledWith(feeTransactionEntry);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransactionEntry>>();
      const feeTransactionEntry = new FeeTransactionEntry();
      jest.spyOn(feeTransactionEntryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransactionEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeTransactionEntry }));
      saveSubject.complete();

      // THEN
      expect(feeTransactionEntryService.create).toHaveBeenCalledWith(feeTransactionEntry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeTransactionEntry>>();
      const feeTransactionEntry = { id: 123 };
      jest.spyOn(feeTransactionEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeTransactionEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feeTransactionEntryService.update).toHaveBeenCalledWith(feeTransactionEntry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFeeTransactionById', () => {
      it('Should return tracked FeeTransaction primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFeeTransactionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
