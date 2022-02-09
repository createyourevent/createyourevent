jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GiftService } from '../service/gift.service';
import { IGift, Gift } from '../gift.model';

import { GiftUpdateComponent } from './gift-update.component';

describe('Gift Management Update Component', () => {
  let comp: GiftUpdateComponent;
  let fixture: ComponentFixture<GiftUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let giftService: GiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GiftUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(GiftUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GiftUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    giftService = TestBed.inject(GiftService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const gift: IGift = { id: 456 };

      activatedRoute.data = of({ gift });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(gift));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Gift>>();
      const gift = { id: 123 };
      jest.spyOn(giftService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gift });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gift }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(giftService.update).toHaveBeenCalledWith(gift);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Gift>>();
      const gift = new Gift();
      jest.spyOn(giftService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gift });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gift }));
      saveSubject.complete();

      // THEN
      expect(giftService.create).toHaveBeenCalledWith(gift);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Gift>>();
      const gift = { id: 123 };
      jest.spyOn(giftService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gift });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(giftService.update).toHaveBeenCalledWith(gift);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
