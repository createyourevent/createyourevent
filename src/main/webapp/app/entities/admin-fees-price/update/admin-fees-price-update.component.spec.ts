jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AdminFeesPriceService } from '../service/admin-fees-price.service';
import { IAdminFeesPrice, AdminFeesPrice } from '../admin-fees-price.model';

import { AdminFeesPriceUpdateComponent } from './admin-fees-price-update.component';

describe('AdminFeesPrice Management Update Component', () => {
  let comp: AdminFeesPriceUpdateComponent;
  let fixture: ComponentFixture<AdminFeesPriceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let adminFeesPriceService: AdminFeesPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdminFeesPriceUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AdminFeesPriceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdminFeesPriceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    adminFeesPriceService = TestBed.inject(AdminFeesPriceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const adminFeesPrice: IAdminFeesPrice = { id: 456 };

      activatedRoute.data = of({ adminFeesPrice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(adminFeesPrice));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdminFeesPrice>>();
      const adminFeesPrice = { id: 123 };
      jest.spyOn(adminFeesPriceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adminFeesPrice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adminFeesPrice }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(adminFeesPriceService.update).toHaveBeenCalledWith(adminFeesPrice);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdminFeesPrice>>();
      const adminFeesPrice = new AdminFeesPrice();
      jest.spyOn(adminFeesPriceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adminFeesPrice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adminFeesPrice }));
      saveSubject.complete();

      // THEN
      expect(adminFeesPriceService.create).toHaveBeenCalledWith(adminFeesPrice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdminFeesPrice>>();
      const adminFeesPrice = { id: 123 };
      jest.spyOn(adminFeesPriceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adminFeesPrice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(adminFeesPriceService.update).toHaveBeenCalledWith(adminFeesPrice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
