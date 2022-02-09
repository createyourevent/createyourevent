jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RideCostsService } from '../service/ride-costs.service';
import { IRideCosts, RideCosts } from '../ride-costs.model';

import { RideCostsUpdateComponent } from './ride-costs-update.component';

describe('RideCosts Management Update Component', () => {
  let comp: RideCostsUpdateComponent;
  let fixture: ComponentFixture<RideCostsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rideCostsService: RideCostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RideCostsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(RideCostsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RideCostsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rideCostsService = TestBed.inject(RideCostsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const rideCosts: IRideCosts = { id: 456 };

      activatedRoute.data = of({ rideCosts });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(rideCosts));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RideCosts>>();
      const rideCosts = { id: 123 };
      jest.spyOn(rideCostsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rideCosts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rideCosts }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(rideCostsService.update).toHaveBeenCalledWith(rideCosts);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RideCosts>>();
      const rideCosts = new RideCosts();
      jest.spyOn(rideCostsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rideCosts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rideCosts }));
      saveSubject.complete();

      // THEN
      expect(rideCostsService.create).toHaveBeenCalledWith(rideCosts);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RideCosts>>();
      const rideCosts = { id: 123 };
      jest.spyOn(rideCostsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rideCosts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rideCostsService.update).toHaveBeenCalledWith(rideCosts);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
