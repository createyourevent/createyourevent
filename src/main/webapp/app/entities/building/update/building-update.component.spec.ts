jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BuildingService } from '../service/building.service';
import { IBuilding, Building } from '../building.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { BuildingUpdateComponent } from './building-update.component';

describe('Building Management Update Component', () => {
  let comp: BuildingUpdateComponent;
  let fixture: ComponentFixture<BuildingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let buildingService: BuildingService;
  let organizationService: OrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BuildingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(BuildingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BuildingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    buildingService = TestBed.inject(BuildingService);
    organizationService = TestBed.inject(OrganizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call organization query and add missing value', () => {
      const building: IBuilding = { id: 456 };
      const organization: IOrganization = { id: 77041 };
      building.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 84022 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const expectedCollection: IOrganization[] = [organization, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ building });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(organizationCollection, organization);
      expect(comp.organizationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const building: IBuilding = { id: 456 };
      const organization: IOrganization = { id: 64627 };
      building.organization = organization;

      activatedRoute.data = of({ building });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(building));
      expect(comp.organizationsCollection).toContain(organization);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Building>>();
      const building = { id: 123 };
      jest.spyOn(buildingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ building });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: building }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(buildingService.update).toHaveBeenCalledWith(building);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Building>>();
      const building = new Building();
      jest.spyOn(buildingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ building });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: building }));
      saveSubject.complete();

      // THEN
      expect(buildingService.create).toHaveBeenCalledWith(building);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Building>>();
      const building = { id: 123 };
      jest.spyOn(buildingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ building });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(buildingService.update).toHaveBeenCalledWith(building);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOrganizationById', () => {
      it('Should return tracked Organization primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrganizationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
