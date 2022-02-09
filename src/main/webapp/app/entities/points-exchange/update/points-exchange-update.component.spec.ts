jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PointsExchangeService } from '../service/points-exchange.service';
import { IPointsExchange, PointsExchange } from '../points-exchange.model';

import { PointsExchangeUpdateComponent } from './points-exchange-update.component';

describe('PointsExchange Management Update Component', () => {
  let comp: PointsExchangeUpdateComponent;
  let fixture: ComponentFixture<PointsExchangeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pointsExchangeService: PointsExchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PointsExchangeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(PointsExchangeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PointsExchangeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pointsExchangeService = TestBed.inject(PointsExchangeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pointsExchange: IPointsExchange = { id: 456 };

      activatedRoute.data = of({ pointsExchange });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pointsExchange));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PointsExchange>>();
      const pointsExchange = { id: 123 };
      jest.spyOn(pointsExchangeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pointsExchange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pointsExchange }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pointsExchangeService.update).toHaveBeenCalledWith(pointsExchange);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PointsExchange>>();
      const pointsExchange = new PointsExchange();
      jest.spyOn(pointsExchangeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pointsExchange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pointsExchange }));
      saveSubject.complete();

      // THEN
      expect(pointsExchangeService.create).toHaveBeenCalledWith(pointsExchange);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PointsExchange>>();
      const pointsExchange = { id: 123 };
      jest.spyOn(pointsExchangeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pointsExchange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pointsExchangeService.update).toHaveBeenCalledWith(pointsExchange);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
