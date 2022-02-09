jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventProductRatingService } from '../service/event-product-rating.service';

import { EventProductRatingDeleteDialogComponent } from './event-product-rating-delete-dialog.component';

describe('EventProductRating Management Delete Component', () => {
  let comp: EventProductRatingDeleteDialogComponent;
  let fixture: ComponentFixture<EventProductRatingDeleteDialogComponent>;
  let service: EventProductRatingService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventProductRatingDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(EventProductRatingDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventProductRatingDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventProductRatingService);
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
