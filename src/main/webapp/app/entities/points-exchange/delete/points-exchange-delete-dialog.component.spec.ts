jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PointsExchangeService } from '../service/points-exchange.service';

import { PointsExchangeDeleteDialogComponent } from './points-exchange-delete-dialog.component';

describe('PointsExchange Management Delete Component', () => {
  let comp: PointsExchangeDeleteDialogComponent;
  let fixture: ComponentFixture<PointsExchangeDeleteDialogComponent>;
  let service: PointsExchangeService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PointsExchangeDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(PointsExchangeDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PointsExchangeDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PointsExchangeService);
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
