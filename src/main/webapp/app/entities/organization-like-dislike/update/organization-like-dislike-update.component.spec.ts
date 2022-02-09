jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrganizationLikeDislikeService } from '../service/organization-like-dislike.service';
import { IOrganizationLikeDislike, OrganizationLikeDislike } from '../organization-like-dislike.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { OrganizationLikeDislikeUpdateComponent } from './organization-like-dislike-update.component';

describe('OrganizationLikeDislike Management Update Component', () => {
  let comp: OrganizationLikeDislikeUpdateComponent;
  let fixture: ComponentFixture<OrganizationLikeDislikeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationLikeDislikeService: OrganizationLikeDislikeService;
  let organizationService: OrganizationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrganizationLikeDislikeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(OrganizationLikeDislikeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationLikeDislikeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationLikeDislikeService = TestBed.inject(OrganizationLikeDislikeService);
    organizationService = TestBed.inject(OrganizationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organization query and add missing value', () => {
      const organizationLikeDislike: IOrganizationLikeDislike = { id: 456 };
      const organization: IOrganization = { id: 77843 };
      organizationLikeDislike.organization = organization;
      const event: IOrganization = { id: 39261 };
      organizationLikeDislike.event = event;

      const organizationCollection: IOrganization[] = [{ id: 31862 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization, event];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationLikeDislike });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const organizationLikeDislike: IOrganizationLikeDislike = { id: 456 };
      const user: IUser = { id: '4ab62fad-0f1a-49f3-a21d-677f01c32d73' };
      organizationLikeDislike.user = user;

      const userCollection: IUser[] = [{ id: 'ebe229ee-522a-4dad-80de-8614ad68cc7a' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationLikeDislike });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const organizationLikeDislike: IOrganizationLikeDislike = { id: 456 };
      const organization: IOrganization = { id: 87861 };
      organizationLikeDislike.organization = organization;
      const event: IOrganization = { id: 9263 };
      organizationLikeDislike.event = event;
      const user: IUser = { id: '87b9b5e8-5539-4718-af35-8e78499f1fea' };
      organizationLikeDislike.user = user;

      activatedRoute.data = of({ organizationLikeDislike });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organizationLikeDislike));
      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.organizationsSharedCollection).toContain(event);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationLikeDislike>>();
      const organizationLikeDislike = { id: 123 };
      jest.spyOn(organizationLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationLikeDislikeService.update).toHaveBeenCalledWith(organizationLikeDislike);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationLikeDislike>>();
      const organizationLikeDislike = new OrganizationLikeDislike();
      jest.spyOn(organizationLikeDislikeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(organizationLikeDislikeService.create).toHaveBeenCalledWith(organizationLikeDislike);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationLikeDislike>>();
      const organizationLikeDislike = { id: 123 };
      jest.spyOn(organizationLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationLikeDislikeService.update).toHaveBeenCalledWith(organizationLikeDislike);
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
