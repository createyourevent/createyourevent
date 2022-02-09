jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrganizationCommentService } from '../service/organization-comment.service';
import { IOrganizationComment, OrganizationComment } from '../organization-comment.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { OrganizationCommentUpdateComponent } from './organization-comment-update.component';

describe('OrganizationComment Management Update Component', () => {
  let comp: OrganizationCommentUpdateComponent;
  let fixture: ComponentFixture<OrganizationCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationCommentService: OrganizationCommentService;
  let organizationService: OrganizationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrganizationCommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(OrganizationCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationCommentService = TestBed.inject(OrganizationCommentService);
    organizationService = TestBed.inject(OrganizationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call OrganizationComment query and add missing value', () => {
      const organizationComment: IOrganizationComment = { id: 456 };
      const organizationComment: IOrganizationComment = { id: 89603 };
      organizationComment.organizationComment = organizationComment;

      const organizationCommentCollection: IOrganizationComment[] = [{ id: 32689 }];
      jest.spyOn(organizationCommentService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCommentCollection })));
      const additionalOrganizationComments = [organizationComment];
      const expectedCollection: IOrganizationComment[] = [...additionalOrganizationComments, ...organizationCommentCollection];
      jest.spyOn(organizationCommentService, 'addOrganizationCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationComment });
      comp.ngOnInit();

      expect(organizationCommentService.query).toHaveBeenCalled();
      expect(organizationCommentService.addOrganizationCommentToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCommentCollection,
        ...additionalOrganizationComments
      );
      expect(comp.organizationCommentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Organization query and add missing value', () => {
      const organizationComment: IOrganizationComment = { id: 456 };
      const organization: IOrganization = { id: 28071 };
      organizationComment.organization = organization;
      const event: IOrganization = { id: 86299 };
      organizationComment.event = event;

      const organizationCollection: IOrganization[] = [{ id: 52373 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization, event];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationComment });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const organizationComment: IOrganizationComment = { id: 456 };
      const user: IUser = { id: 'bc76ba6a-d33f-4194-87e4-2e51d6a64106' };
      organizationComment.user = user;

      const userCollection: IUser[] = [{ id: 'b8ebaf8a-bb5e-4630-9ecb-a2dc25c65cbc' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const organizationComment: IOrganizationComment = { id: 456 };
      const organizationComment: IOrganizationComment = { id: 68509 };
      organizationComment.organizationComment = organizationComment;
      const organization: IOrganization = { id: 10601 };
      organizationComment.organization = organization;
      const event: IOrganization = { id: 79559 };
      organizationComment.event = event;
      const user: IUser = { id: '831e7c37-6f0f-43b6-94ba-bc81e1582649' };
      organizationComment.user = user;

      activatedRoute.data = of({ organizationComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organizationComment));
      expect(comp.organizationCommentsSharedCollection).toContain(organizationComment);
      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.organizationsSharedCollection).toContain(event);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationComment>>();
      const organizationComment = { id: 123 };
      jest.spyOn(organizationCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationCommentService.update).toHaveBeenCalledWith(organizationComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationComment>>();
      const organizationComment = new OrganizationComment();
      jest.spyOn(organizationCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationComment }));
      saveSubject.complete();

      // THEN
      expect(organizationCommentService.create).toHaveBeenCalledWith(organizationComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationComment>>();
      const organizationComment = { id: 123 };
      jest.spyOn(organizationCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationCommentService.update).toHaveBeenCalledWith(organizationComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOrganizationCommentById', () => {
      it('Should return tracked OrganizationComment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrganizationCommentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

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
