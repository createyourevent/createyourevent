jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ServiceLikeDislikeService } from '../service/service-like-dislike.service';

import { ServiceLikeDislikeDeleteDialogComponent } from './service-like-dislike-delete-dialog.component';

describe('ServiceLikeDislike Management Delete Component', () => {
  let comp: ServiceLikeDislikeDeleteDialogComponent;
  let fixture: ComponentFixture<ServiceLikeDislikeDeleteDialogComponent>;
  let service: ServiceLikeDislikeService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceLikeDislikeDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ServiceLikeDislikeDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ServiceLikeDislikeDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ServiceLikeDislikeService);
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
