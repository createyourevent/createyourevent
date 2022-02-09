jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeeTransactionIdService } from '../service/fee-transaction-id.service';

import { FeeTransactionIdDeleteDialogComponent } from './fee-transaction-id-delete-dialog.component';

describe('FeeTransactionId Management Delete Component', () => {
  let comp: FeeTransactionIdDeleteDialogComponent;
  let fixture: ComponentFixture<FeeTransactionIdDeleteDialogComponent>;
  let service: FeeTransactionIdService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FeeTransactionIdDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(FeeTransactionIdDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeeTransactionIdDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FeeTransactionIdService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
