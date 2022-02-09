jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AdminFeesPriceService } from '../service/admin-fees-price.service';

import { AdminFeesPriceDeleteDialogComponent } from './admin-fees-price-delete-dialog.component';

describe('AdminFeesPrice Management Delete Component', () => {
  let comp: AdminFeesPriceDeleteDialogComponent;
  let fixture: ComponentFixture<AdminFeesPriceDeleteDialogComponent>;
  let service: AdminFeesPriceService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdminFeesPriceDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(AdminFeesPriceDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdminFeesPriceDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AdminFeesPriceService);
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
