jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SlotListPlumService } from '../service/slot-list-plum.service';
import { ISlotListPlum, SlotListPlum } from '../slot-list-plum.model';

import { SlotListPlumUpdateComponent } from './slot-list-plum-update.component';

describe('SlotListPlum Management Update Component', () => {
  let comp: SlotListPlumUpdateComponent;
  let fixture: ComponentFixture<SlotListPlumUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let slotListPlumService: SlotListPlumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SlotListPlumUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SlotListPlumUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SlotListPlumUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    slotListPlumService = TestBed.inject(SlotListPlumService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const slotListPlum: ISlotListPlum = { id: 456 };

      activatedRoute.data = of({ slotListPlum });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(slotListPlum));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListPlum>>();
      const slotListPlum = { id: 123 };
      jest.spyOn(slotListPlumService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListPlum });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListPlum }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(slotListPlumService.update).toHaveBeenCalledWith(slotListPlum);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListPlum>>();
      const slotListPlum = new SlotListPlum();
      jest.spyOn(slotListPlumService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListPlum });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListPlum }));
      saveSubject.complete();

      // THEN
      expect(slotListPlumService.create).toHaveBeenCalledWith(slotListPlum);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListPlum>>();
      const slotListPlum = { id: 123 };
      jest.spyOn(slotListPlumService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListPlum });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(slotListPlumService.update).toHaveBeenCalledWith(slotListPlum);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
