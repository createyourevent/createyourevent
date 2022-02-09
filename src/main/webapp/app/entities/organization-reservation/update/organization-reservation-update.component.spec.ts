jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrganizationReservationService } from '../service/organization-reservation.service';
import { IOrganizationReservation, OrganizationReservation } from '../organization-reservation.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { OrganizationReservationUpdateComponent } from './organization-reservation-update.component';

describe('OrganizationReservation Management Update Component', () => {
  let comp: OrganizationReservationUpdateComponent;
  let fixture: ComponentFixture<OrganizationReservationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationReservationService: OrganizationReservationService;
  let userService: UserService;
  let eventService: EventService;
  let organizationService: OrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrganizationReservationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(OrganizationReservationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationReservationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationReservationService = TestBed.inject(OrganizationReservationService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);
    organizationService = TestBed.inject(OrganizationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const organizationReservation: IOrganizationReservation = { id: 456 };
      const user: IUser = { id: '7cdae0d6-ebce-44bb-b44f-8f09128d8c9f' };
      organizationReservation.user = user;

      const userCollection: IUser[] = [{ id: 'd7c767d6-7ce0-4df5-9219-2a64338bec50' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationReservation });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const organizationReservation: IOrganizationReservation = { id: 456 };
      const event: IEvent = { id: 56230 };
      organizationReservation.event = event;

      const eventCollection: IEvent[] = [{ id: 2476 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationReservation });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Organization query and add missing value', () => {
      const organizationReservation: IOrganizationReservation = { id: 456 };
      const organization: IOrganization = { id: 86367 };
      organizationReservation.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 16188 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organizationReservation });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const organizationReservation: IOrganizationReservation = { id: 456 };
      const user: IUser = { id: '031d4b8e-1b2e-474e-91a8-8d9ac31c6fb5' };
      organizationReservation.user = user;
      const event: IEvent = { id: 60122 };
      organizationReservation.event = event;
      const organization: IOrganization = { id: 93123 };
      organizationReservation.organization = organization;

      activatedRoute.data = of({ organizationReservation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organizationReservation));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.organizationsSharedCollection).toContain(organization);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationReservation>>();
      const organizationReservation = { id: 123 };
      jest.spyOn(organizationReservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationReservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationReservation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationReservationService.update).toHaveBeenCalledWith(organizationReservation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationReservation>>();
      const organizationReservation = new OrganizationReservation();
      jest.spyOn(organizationReservationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationReservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationReservation }));
      saveSubject.complete();

      // THEN
      expect(organizationReservationService.create).toHaveBeenCalledWith(organizationReservation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationReservation>>();
      const organizationReservation = { id: 123 };
      jest.spyOn(organizationReservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationReservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationReservationService.update).toHaveBeenCalledWith(organizationReservation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
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
  });
});
