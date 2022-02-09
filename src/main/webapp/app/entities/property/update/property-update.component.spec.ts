jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PropertyService } from '../service/property.service';
import { IProperty, Property } from '../property.model';

import { PropertyUpdateComponent } from './property-update.component';

describe('Property Management Update Component', () => {
  let comp: PropertyUpdateComponent;
  let fixture: ComponentFixture<PropertyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let propertyService: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PropertyUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(PropertyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PropertyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    propertyService = TestBed.inject(PropertyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const property: IProperty = { id: 456 };

      activatedRoute.data = of({ property });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(property));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Property>>();
      const property = { id: 123 };
      jest.spyOn(propertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ property });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: property }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(propertyService.update).toHaveBeenCalledWith(property);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Property>>();
      const property = new Property();
      jest.spyOn(propertyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ property });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: property }));
      saveSubject.complete();

      // THEN
      expect(propertyService.create).toHaveBeenCalledWith(property);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Property>>();
      const property = { id: 123 };
      jest.spyOn(propertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ property });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(propertyService.update).toHaveBeenCalledWith(property);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
