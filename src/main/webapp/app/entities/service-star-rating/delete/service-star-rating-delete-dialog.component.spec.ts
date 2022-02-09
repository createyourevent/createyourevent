jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ServiceStarRatingService } from '../service/service-star-rating.service';

import { ServiceStarRatingDeleteDialogComponent } from './service-star-rating-delete-dialog.component';

describe('ServiceStarRating Management Delete Component', () => {
  let comp: ServiceStarRatingDeleteDialogComponent;
  let fixture: ComponentFixture<ServiceStarRatingDeleteDialogComponent>;
  let service: ServiceStarRatingService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceStarRatingDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ServiceStarRatingDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ServiceStarRatingDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ServiceStarRatingService);
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
