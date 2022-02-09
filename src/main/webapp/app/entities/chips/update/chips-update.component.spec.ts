jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChipsService } from '../service/chips.service';
import { IChips, Chips } from '../chips.model';

import { ChipsUpdateComponent } from './chips-update.component';

describe('Chips Management Update Component', () => {
  let comp: ChipsUpdateComponent;
  let fixture: ComponentFixture<ChipsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chipsService: ChipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChipsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ChipsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChipsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chipsService = TestBed.inject(ChipsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const chips: IChips = { id: 456 };

      activatedRoute.data = of({ chips });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chips));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chips>>();
      const chips = { id: 123 };
      jest.spyOn(chipsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chips });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chips }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chipsService.update).toHaveBeenCalledWith(chips);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chips>>();
      const chips = new Chips();
      jest.spyOn(chipsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chips });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chips }));
      saveSubject.complete();

      // THEN
      expect(chipsService.create).toHaveBeenCalledWith(chips);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chips>>();
      const chips = { id: 123 };
      jest.spyOn(chipsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chips });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chipsService.update).toHaveBeenCalledWith(chips);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
