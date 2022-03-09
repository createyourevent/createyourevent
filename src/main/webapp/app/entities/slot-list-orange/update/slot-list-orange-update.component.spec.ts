jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SlotListOrangeService } from '../service/slot-list-orange.service';
import { ISlotListOrange, SlotListOrange } from '../slot-list-orange.model';

import { SlotListOrangeUpdateComponent } from './slot-list-orange-update.component';

describe('SlotListOrange Management Update Component', () => {
  let comp: SlotListOrangeUpdateComponent;
  let fixture: ComponentFixture<SlotListOrangeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let slotListOrangeService: SlotListOrangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SlotListOrangeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SlotListOrangeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SlotListOrangeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    slotListOrangeService = TestBed.inject(SlotListOrangeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const slotListOrange: ISlotListOrange = { id: 456 };

      activatedRoute.data = of({ slotListOrange });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(slotListOrange));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListOrange>>();
      const slotListOrange = { id: 123 };
      jest.spyOn(slotListOrangeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListOrange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListOrange }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(slotListOrangeService.update).toHaveBeenCalledWith(slotListOrange);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListOrange>>();
      const slotListOrange = new SlotListOrange();
      jest.spyOn(slotListOrangeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListOrange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListOrange }));
      saveSubject.complete();

      // THEN
      expect(slotListOrangeService.create).toHaveBeenCalledWith(slotListOrange);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListOrange>>();
      const slotListOrange = { id: 123 };
      jest.spyOn(slotListOrangeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListOrange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(slotListOrangeService.update).toHaveBeenCalledWith(slotListOrange);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
