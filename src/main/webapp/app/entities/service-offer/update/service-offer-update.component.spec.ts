jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServiceOfferService } from '../service/service-offer.service';
import { IServiceOffer, ServiceOffer } from '../service-offer.model';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ServiceMapService } from 'app/entities/service-map/service/service-map.service';

import { ServiceOfferUpdateComponent } from './service-offer-update.component';

describe('ServiceOffer Management Update Component', () => {
  let comp: ServiceOfferUpdateComponent;
  let fixture: ComponentFixture<ServiceOfferUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceOfferService: ServiceOfferService;
  let serviceMapService: ServiceMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceOfferUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ServiceOfferUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceOfferUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceOfferService = TestBed.inject(ServiceOfferService);
    serviceMapService = TestBed.inject(ServiceMapService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ServiceMap query and add missing value', () => {
      const serviceOffer: IServiceOffer = { id: 456 };
      const serviceMaps: IServiceMap = { id: 34314 };
      serviceOffer.serviceMaps = serviceMaps;

      const serviceMapCollection: IServiceMap[] = [{ id: 25049 }];
      jest.spyOn(serviceMapService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceMapCollection })));
      const additionalServiceMaps = [serviceMaps];
      const expectedCollection: IServiceMap[] = [...additionalServiceMaps, ...serviceMapCollection];
      jest.spyOn(serviceMapService, 'addServiceMapToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceOffer });
      comp.ngOnInit();

      expect(serviceMapService.query).toHaveBeenCalled();
      expect(serviceMapService.addServiceMapToCollectionIfMissing).toHaveBeenCalledWith(serviceMapCollection, ...additionalServiceMaps);
      expect(comp.serviceMapsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serviceOffer: IServiceOffer = { id: 456 };
      const serviceMaps: IServiceMap = { id: 56267 };
      serviceOffer.serviceMaps = serviceMaps;

      activatedRoute.data = of({ serviceOffer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(serviceOffer));
      expect(comp.serviceMapsSharedCollection).toContain(serviceMaps);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceOffer>>();
      const serviceOffer = { id: 123 };
      jest.spyOn(serviceOfferService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceOffer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceOffer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceOfferService.update).toHaveBeenCalledWith(serviceOffer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceOffer>>();
      const serviceOffer = new ServiceOffer();
      jest.spyOn(serviceOfferService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceOffer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceOffer }));
      saveSubject.complete();

      // THEN
      expect(serviceOfferService.create).toHaveBeenCalledWith(serviceOffer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceOffer>>();
      const serviceOffer = { id: 123 };
      jest.spyOn(serviceOfferService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceOffer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceOfferService.update).toHaveBeenCalledWith(serviceOffer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackServiceMapById', () => {
      it('Should return tracked ServiceMap primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackServiceMapById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
