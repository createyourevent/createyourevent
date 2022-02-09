jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventStarRatingService } from '../service/event-star-rating.service';
import { IEventStarRating, EventStarRating } from '../event-star-rating.model';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { EventStarRatingUpdateComponent } from './event-star-rating-update.component';

describe('EventStarRating Management Update Component', () => {
  let comp: EventStarRatingUpdateComponent;
  let fixture: ComponentFixture<EventStarRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventStarRatingService: EventStarRatingService;
  let eventService: EventService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventStarRatingUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventStarRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventStarRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventStarRatingService = TestBed.inject(EventStarRatingService);
    eventService = TestBed.inject(EventService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Event query and add missing value', () => {
      const eventStarRating: IEventStarRating = { id: 456 };
      const event: IEvent = { id: 18298 };
      eventStarRating.event = event;

      const eventCollection: IEvent[] = [{ id: 3261 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventStarRating });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const eventStarRating: IEventStarRating = { id: 456 };
      const user: IUser = { id: 'a291657b-9f3a-4d5c-99be-4e1c9552fc75' };
      eventStarRating.user = user;

      const userCollection: IUser[] = [{ id: 'cf3c0451-5824-41f7-a206-3982fc33df6e' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventStarRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventStarRating: IEventStarRating = { id: 456 };
      const event: IEvent = { id: 26284 };
      eventStarRating.event = event;
      const user: IUser = { id: 'e0938c34-eb89-4432-8580-2438b5e534f8' };
      eventStarRating.user = user;

      activatedRoute.data = of({ eventStarRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventStarRating));
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventStarRating>>();
      const eventStarRating = { id: 123 };
      jest.spyOn(eventStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventStarRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventStarRatingService.update).toHaveBeenCalledWith(eventStarRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventStarRating>>();
      const eventStarRating = new EventStarRating();
      jest.spyOn(eventStarRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventStarRating }));
      saveSubject.complete();

      // THEN
      expect(eventStarRatingService.create).toHaveBeenCalledWith(eventStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventStarRating>>();
      const eventStarRating = { id: 123 };
      jest.spyOn(eventStarRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventStarRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventStarRatingService.update).toHaveBeenCalledWith(eventStarRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
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
