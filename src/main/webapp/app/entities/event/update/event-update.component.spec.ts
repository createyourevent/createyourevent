jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventService } from '../service/event.service';
import { IEvent, Event } from '../event.model';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IEventDetails } from 'app/entities/event-details/event-details.model';
import { EventDetailsService } from 'app/entities/event-details/service/event-details.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { EventUpdateComponent } from './event-update.component';

describe('Event Management Update Component', () => {
  let comp: EventUpdateComponent;
  let fixture: ComponentFixture<EventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventService: EventService;
  let locationService: LocationService;
  let eventDetailsService: EventDetailsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventService = TestBed.inject(EventService);
    locationService = TestBed.inject(LocationService);
    eventDetailsService = TestBed.inject(EventDetailsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call location query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const location: ILocation = { id: 42887 };
      event.location = location;

      const locationCollection: ILocation[] = [{ id: 91552 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: ILocation[] = [location, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection).toEqual(expectedCollection);
    });

    it('Should call eventDetail query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const eventDetail: IEventDetails = { id: 68161 };
      event.eventDetail = eventDetail;

      const eventDetailCollection: IEventDetails[] = [{ id: 55431 }];
      jest.spyOn(eventDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: eventDetailCollection })));
      const expectedCollection: IEventDetails[] = [eventDetail, ...eventDetailCollection];
      jest.spyOn(eventDetailsService, 'addEventDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(eventDetailsService.query).toHaveBeenCalled();
      expect(eventDetailsService.addEventDetailsToCollectionIfMissing).toHaveBeenCalledWith(eventDetailCollection, eventDetail);
      expect(comp.eventDetailsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const user: IUser = { id: '83cc729d-6e43-4bd0-afe5-a3b889d2701c' };
      event.user = user;
      const reservedUsers: IUser[] = [{ id: '744fe0da-b82a-45d2-a14d-63d58fcaf701' }];
      event.reservedUsers = reservedUsers;

      const userCollection: IUser[] = [{ id: '6555ca05-f764-4ea7-b103-c0e5967642d0' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user, ...reservedUsers];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const event: IEvent = { id: 456 };
      const location: ILocation = { id: 66855 };
      event.location = location;
      const eventDetail: IEventDetails = { id: 5620 };
      event.eventDetail = eventDetail;
      const user: IUser = { id: '2be730d2-120a-4a9d-844d-bf60006a7714' };
      event.user = user;
      const reservedUsers: IUser = { id: 'b4b616e8-c3cd-461c-9a07-f0cf22029bd0' };
      event.reservedUsers = [reservedUsers];

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(event));
      expect(comp.locationsCollection).toContain(location);
      expect(comp.eventDetailsCollection).toContain(eventDetail);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.usersSharedCollection).toContain(reservedUsers);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Event>>();
      const event = { id: 123 };
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventService.update).toHaveBeenCalledWith(event);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Event>>();
      const event = new Event();
      jest.spyOn(eventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventService.create).toHaveBeenCalledWith(event);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Event>>();
      const event = { id: 123 };
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventService.update).toHaveBeenCalledWith(event);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLocationById', () => {
      it('Should return tracked Location primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLocationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEventDetailsById', () => {
      it('Should return tracked EventDetails primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventDetailsById(0, entity);
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

  describe('Getting selected relationships', () => {
    describe('getSelectedUser', () => {
      it('Should return option if no User is selected', () => {
        const option = { id: 'ABC' };
        const result = comp.getSelectedUser(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected User for according option', () => {
        const option = { id: 'ABC' };
        const selected = { id: 'ABC' };
        const selected2 = { id: 'CBA' };
        const result = comp.getSelectedUser(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this User is not selected', () => {
        const option = { id: 'ABC' };
        const selected = { id: 'CBA' };
        const result = comp.getSelectedUser(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
