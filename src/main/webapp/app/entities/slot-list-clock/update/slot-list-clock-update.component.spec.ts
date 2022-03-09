jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SlotListClockService } from '../service/slot-list-clock.service';
import { ISlotListClock, SlotListClock } from '../slot-list-clock.model';

import { SlotListClockUpdateComponent } from './slot-list-clock-update.component';

describe('SlotListClock Management Update Component', () => {
  let comp: SlotListClockUpdateComponent;
  let fixture: ComponentFixture<SlotListClockUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let slotListClockService: SlotListClockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SlotListClockUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SlotListClockUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SlotListClockUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    slotListClockService = TestBed.inject(SlotListClockService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const slotListClock: ISlotListClock = { id: 456 };

      activatedRoute.data = of({ slotListClock });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(slotListClock));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListClock>>();
      const slotListClock = { id: 123 };
      jest.spyOn(slotListClockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListClock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListClock }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(slotListClockService.update).toHaveBeenCalledWith(slotListClock);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListClock>>();
      const slotListClock = new SlotListClock();
      jest.spyOn(slotListClockService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListClock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListClock }));
      saveSubject.complete();

      // THEN
      expect(slotListClockService.create).toHaveBeenCalledWith(slotListClock);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListClock>>();
      const slotListClock = { id: 123 };
      jest.spyOn(slotListClockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListClock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(slotListClockService.update).toHaveBeenCalledWith(slotListClock);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
