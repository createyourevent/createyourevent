jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventLikeDislikeService } from '../service/event-like-dislike.service';

import { EventLikeDislikeDeleteDialogComponent } from './event-like-dislike-delete-dialog.component';

describe('EventLikeDislike Management Delete Component', () => {
  let comp: EventLikeDislikeDeleteDialogComponent;
  let fixture: ComponentFixture<EventLikeDislikeDeleteDialogComponent>;
  let service: EventLikeDislikeService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventLikeDislikeDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(EventLikeDislikeDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventLikeDislikeDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventLikeDislikeService);
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
