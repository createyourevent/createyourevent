jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductLikeDislikeService } from '../service/product-like-dislike.service';

import { ProductLikeDislikeDeleteDialogComponent } from './product-like-dislike-delete-dialog.component';

describe('ProductLikeDislike Management Delete Component', () => {
  let comp: ProductLikeDislikeDeleteDialogComponent;
  let fixture: ComponentFixture<ProductLikeDislikeDeleteDialogComponent>;
  let service: ProductLikeDislikeService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductLikeDislikeDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ProductLikeDislikeDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductLikeDislikeDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductLikeDislikeService);
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
