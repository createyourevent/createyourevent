jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ClubService } from '../service/club.service';
import { IClub, Club } from '../club.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ClubUpdateComponent } from './club-update.component';

describe('Club Management Update Component', () => {
  let comp: ClubUpdateComponent;
  let fixture: ComponentFixture<ClubUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clubService: ClubService;
  let organizationService: OrganizationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClubUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ClubUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClubUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clubService = TestBed.inject(ClubService);
    organizationService = TestBed.inject(OrganizationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call organization query and add missing value', () => {
      const club: IClub = { id: 456 };
      const organization: IOrganization = { id: 33704 };
      club.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 79940 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const expectedCollection: IOrganization[] = [organization, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ club });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(organizationCollection, organization);
      expect(comp.organizationsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const club: IClub = { id: 456 };
      const user: IUser = { id: '44bed828-aed9-4598-bb26-05d73c0dfe24' };
      club.user = user;

      const userCollection: IUser[] = [{ id: '5f6dc281-8709-4849-9eea-ad55a4f6becc' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ club });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const club: IClub = { id: 456 };
      const organization: IOrganization = { id: 43970 };
      club.organization = organization;
      const user: IUser = { id: '065b2ef5-0f60-4dd3-8f4c-33d660fac8fc' };
      club.user = user;

      activatedRoute.data = of({ club });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(club));
      expect(comp.organizationsCollection).toContain(organization);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Club>>();
      const club = { id: 123 };
      jest.spyOn(clubService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ club });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: club }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(clubService.update).toHaveBeenCalledWith(club);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Club>>();
      const club = new Club();
      jest.spyOn(clubService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ club });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: club }));
      saveSubject.complete();

      // THEN
      expect(clubService.create).toHaveBeenCalledWith(club);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Club>>();
      const club = { id: 123 };
      jest.spyOn(clubService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ club });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clubService.update).toHaveBeenCalledWith(club);
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
