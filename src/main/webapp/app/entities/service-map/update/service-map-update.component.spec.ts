jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServiceMapService } from '../service/service-map.service';
import { IServiceMap, ServiceMap } from '../service-map.model';
import { IRideCosts } from 'app/entities/ride-costs/ride-costs.model';
import { RideCostsService } from 'app/entities/ride-costs/service/ride-costs.service';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';

import { ServiceMapUpdateComponent } from './service-map-update.component';

describe('ServiceMap Management Update Component', () => {
  let comp: ServiceMapUpdateComponent;
  let fixture: ComponentFixture<ServiceMapUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceMapService: ServiceMapService;
  let rideCostsService: RideCostsService;
  let createYourEventServiceService: CreateYourEventServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceMapUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ServiceMapUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceMapUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceMapService = TestBed.inject(ServiceMapService);
    rideCostsService = TestBed.inject(RideCostsService);
    createYourEventServiceService = TestBed.inject(CreateYourEventServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call rideCost query and add missing value', () => {
      const serviceMap: IServiceMap = { id: 456 };
      const rideCost: IRideCosts = { id: 71305 };
      serviceMap.rideCost = rideCost;

      const rideCostCollection: IRideCosts[] = [{ id: 55219 }];
      jest.spyOn(rideCostsService, 'query').mockReturnValue(of(new HttpResponse({ body: rideCostCollection })));
      const expectedCollection: IRideCosts[] = [rideCost, ...rideCostCollection];
      jest.spyOn(rideCostsService, 'addRideCostsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceMap });
      comp.ngOnInit();

      expect(rideCostsService.query).toHaveBeenCalled();
      expect(rideCostsService.addRideCostsToCollectionIfMissing).toHaveBeenCalledWith(rideCostCollection, rideCost);
      expect(comp.rideCostsCollection).toEqual(expectedCollection);
    });

    it('Should call CreateYourEventService query and add missing value', () => {
      const serviceMap: IServiceMap = { id: 456 };
      const createYourEventService: ICreateYourEventService = { id: 24614 };
      serviceMap.createYourEventService = createYourEventService;

      const createYourEventServiceCollection: ICreateYourEventService[] = [{ id: 64334 }];
      jest.spyOn(createYourEventServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: createYourEventServiceCollection })));
      const additionalCreateYourEventServices = [createYourEventService];
      const expectedCollection: ICreateYourEventService[] = [...additionalCreateYourEventServices, ...createYourEventServiceCollection];
      jest.spyOn(createYourEventServiceService, 'addCreateYourEventServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serviceMap });
      comp.ngOnInit();

      expect(createYourEventServiceService.query).toHaveBeenCalled();
      expect(createYourEventServiceService.addCreateYourEventServiceToCollectionIfMissing).toHaveBeenCalledWith(
        createYourEventServiceCollection,
        ...additionalCreateYourEventServices
      );
      expect(comp.createYourEventServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serviceMap: IServiceMap = { id: 456 };
      const rideCost: IRideCosts = { id: 9296 };
      serviceMap.rideCost = rideCost;
      const createYourEventService: ICreateYourEventService = { id: 61905 };
      serviceMap.createYourEventService = createYourEventService;

      activatedRoute.data = of({ serviceMap });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(serviceMap));
      expect(comp.rideCostsCollection).toContain(rideCost);
      expect(comp.createYourEventServicesSharedCollection).toContain(createYourEventService);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceMap>>();
      const serviceMap = { id: 123 };
      jest.spyOn(serviceMapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceMap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceMap }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceMapService.update).toHaveBeenCalledWith(serviceMap);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceMap>>();
      const serviceMap = new ServiceMap();
      jest.spyOn(serviceMapService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceMap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serviceMap }));
      saveSubject.complete();

      // THEN
      expect(serviceMapService.create).toHaveBeenCalledWith(serviceMap);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ServiceMap>>();
      const serviceMap = { id: 123 };
      jest.spyOn(serviceMapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serviceMap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceMapService.update).toHaveBeenCalledWith(serviceMap);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRideCostsById', () => {
      it('Should return tracked RideCosts primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRideCostsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCreateYourEventServiceById', () => {
      it('Should return tracked CreateYourEventService primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCreateYourEventServiceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
