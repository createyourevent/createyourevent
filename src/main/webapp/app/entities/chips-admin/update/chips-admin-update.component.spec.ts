jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChipsAdminService } from '../service/chips-admin.service';
import { IChipsAdmin, ChipsAdmin } from '../chips-admin.model';

import { ChipsAdminUpdateComponent } from './chips-admin-update.component';

describe('ChipsAdmin Management Update Component', () => {
  let comp: ChipsAdminUpdateComponent;
  let fixture: ComponentFixture<ChipsAdminUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chipsAdminService: ChipsAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChipsAdminUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ChipsAdminUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChipsAdminUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chipsAdminService = TestBed.inject(ChipsAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const chipsAdmin: IChipsAdmin = { id: 456 };

      activatedRoute.data = of({ chipsAdmin });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chipsAdmin));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsAdmin>>();
      const chipsAdmin = { id: 123 };
      jest.spyOn(chipsAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chipsAdmin }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chipsAdminService.update).toHaveBeenCalledWith(chipsAdmin);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsAdmin>>();
      const chipsAdmin = new ChipsAdmin();
      jest.spyOn(chipsAdminService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chipsAdmin }));
      saveSubject.complete();

      // THEN
      expect(chipsAdminService.create).toHaveBeenCalledWith(chipsAdmin);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChipsAdmin>>();
      const chipsAdmin = { id: 123 };
      jest.spyOn(chipsAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chipsAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chipsAdminService.update).toHaveBeenCalledWith(chipsAdmin);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
