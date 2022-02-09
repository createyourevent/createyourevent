jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrganizationStarRatingService } from '../service/organization-star-rating.service';
import { IOrganizationStarRating, OrganizationStarRating } from '../organization-star-rating.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { OrganizationStarRatingUpdateComponent } from './organization-star-rating-update.component';

describe('OrganizationStarRating Management Update Component', () => {
  let comp: OrganizationStarRatingUpdateComponent;
  let fixture: ComponentFixture<OrganizationStarRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationStarRatingService: OrganizationStarRatingService;
  let organizationService: OrganizationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrganizationStarRatingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(OrganizationStarRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationStarRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationStarRatingService = TestBed.inject(OrganizationStarRatingService);
    organizationService = TestBed.inject(OrganizationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organization query and add missing value', () => {
      const organizationStarRating: IOrganizationStarRating = { id: 456 };
      const organization: IOrganization = { id: 10572 };
      organizationStarRating.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 22449 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationStarRating });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const organizationStarRating: IOrganizationStarRating = { id: 456 };
      const user: IUser = { id: 'bd7a5cec-8a64-44ec-9a55-68f8ce37b3fe' };
      organizationStarRating.user = user;

      const userCollection: IUser[] = [{ id: '5c28fa0e-b431-4af5-9ae9-6f6ce08922b7' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationStarRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const organizationStarRating: IOrganizationStarRating = { id: 456 };
      const organization: IOrganization = { id: 87825 };
      organizationStarRating.organization = organization;
      const user: IUser = { id: '8d1f1a67-9d18-4ab1-a142-869615808d78' };
      organizationStarRating.user = user;

      activatedRoute.data = of({ organizationStarRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organizationStarRating));
      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationStarRating>>();
      const organizationStarRating = { id: 123 };
      jest.spyOn(organizationStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationStarRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationStarRatingService.update).toHaveBeenCalledWith(organizationStarRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationStarRating>>();
      const organizationStarRating = new OrganizationStarRating();
      jest.spyOn(organizationStarRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationStarRating }));
      saveSubject.complete();

      // THEN
      expect(organizationStarRatingService.create).toHaveBeenCalledWith(organizationStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationStarRating>>();
      const organizationStarRating = { id: 123 };
      jest.spyOn(organizationStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationStarRatingService.update).toHaveBeenCalledWith(organizationStarRating);
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

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
