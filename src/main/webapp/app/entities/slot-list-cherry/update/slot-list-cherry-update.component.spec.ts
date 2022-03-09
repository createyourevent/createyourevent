jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SlotListCherryService } from '../service/slot-list-cherry.service';
import { ISlotListCherry, SlotListCherry } from '../slot-list-cherry.model';

import { SlotListCherryUpdateComponent } from './slot-list-cherry-update.component';

describe('SlotListCherry Management Update Component', () => {
  let comp: SlotListCherryUpdateComponent;
  let fixture: ComponentFixture<SlotListCherryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let slotListCherryService: SlotListCherryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SlotListCherryUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SlotListCherryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SlotListCherryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    slotListCherryService = TestBed.inject(SlotListCherryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const slotListCherry: ISlotListCherry = { id: 456 };

      activatedRoute.data = of({ slotListCherry });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(slotListCherry));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListCherry>>();
      const slotListCherry = { id: 123 };
      jest.spyOn(slotListCherryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListCherry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListCherry }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(slotListCherryService.update).toHaveBeenCalledWith(slotListCherry);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListCherry>>();
      const slotListCherry = new SlotListCherry();
      jest.spyOn(slotListCherryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListCherry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: slotListCherry }));
      saveSubject.complete();

      // THEN
      expect(slotListCherryService.create).toHaveBeenCalledWith(slotListCherry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SlotListCherry>>();
      const slotListCherry = { id: 123 };
      jest.spyOn(slotListCherryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ slotListCherry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(slotListCherryService.update).toHaveBeenCalledWith(slotListCherry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
