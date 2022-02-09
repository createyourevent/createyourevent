jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventLikeDislikeService } from '../service/event-like-dislike.service';
import { IEventLikeDislike, EventLikeDislike } from '../event-like-dislike.model';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { EventLikeDislikeUpdateComponent } from './event-like-dislike-update.component';

describe('EventLikeDislike Management Update Component', () => {
  let comp: EventLikeDislikeUpdateComponent;
  let fixture: ComponentFixture<EventLikeDislikeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventLikeDislikeService: EventLikeDislikeService;
  let eventService: EventService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventLikeDislikeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventLikeDislikeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventLikeDislikeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventLikeDislikeService = TestBed.inject(EventLikeDislikeService);
    eventService = TestBed.inject(EventService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Event query and add missing value', () => {
      const eventLikeDislike: IEventLikeDislike = { id: 456 };
      const event: IEvent = { id: 96467 };
      eventLikeDislike.event = event;

      const eventCollection: IEvent[] = [{ id: 37773 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventLikeDislike });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const eventLikeDislike: IEventLikeDislike = { id: 456 };
      const user: IUser = { id: 'd687b3eb-195a-4f43-9863-473c38f330df' };
      eventLikeDislike.user = user;

      const userCollection: IUser[] = [{ id: '82286793-2aee-4b25-bc46-4971d4412c11' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventLikeDislike });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventLikeDislike: IEventLikeDislike = { id: 456 };
      const event: IEvent = { id: 77613 };
      eventLikeDislike.event = event;
      const user: IUser = { id: '574e932f-3327-458f-b107-21c2d22d8e46' };
      eventLikeDislike.user = user;

      activatedRoute.data = of({ eventLikeDislike });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventLikeDislike));
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventLikeDislike>>();
      const eventLikeDislike = { id: 123 };
      jest.spyOn(eventLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventLikeDislikeService.update).toHaveBeenCalledWith(eventLikeDislike);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventLikeDislike>>();
      const eventLikeDislike = new EventLikeDislike();
      jest.spyOn(eventLikeDislikeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventLikeDislike }));
      saveSubject.complete();

      // THEN
      expect(eventLikeDislikeService.create).toHaveBeenCalledWith(eventLikeDislike);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventLikeDislike>>();
      const eventLikeDislike = { id: 123 };
      jest.spyOn(eventLikeDislikeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventLikeDislike });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventLikeDislikeService.update).toHaveBeenCalledWith(eventLikeDislike);
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
