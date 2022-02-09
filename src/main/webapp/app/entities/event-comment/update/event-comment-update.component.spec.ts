jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventCommentService } from '../service/event-comment.service';
import { IEventComment, EventComment } from '../event-comment.model';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { EventCommentUpdateComponent } from './event-comment-update.component';

describe('EventComment Management Update Component', () => {
  let comp: EventCommentUpdateComponent;
  let fixture: ComponentFixture<EventCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventCommentService: EventCommentService;
  let eventService: EventService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventCommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventCommentService = TestBed.inject(EventCommentService);
    eventService = TestBed.inject(EventService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call EventComment query and add missing value', () => {
      const eventComment: IEventComment = { id: 456 };
      const eventComment: IEventComment = { id: 24666 };
      eventComment.eventComment = eventComment;

      const eventCommentCollection: IEventComment[] = [{ id: 15483 }];
      jest.spyOn(eventCommentService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCommentCollection })));
      const additionalEventComments = [eventComment];
      const expectedCollection: IEventComment[] = [...additionalEventComments, ...eventCommentCollection];
      jest.spyOn(eventCommentService, 'addEventCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventComment });
      comp.ngOnInit();

      expect(eventCommentService.query).toHaveBeenCalled();
      expect(eventCommentService.addEventCommentToCollectionIfMissing).toHaveBeenCalledWith(
        eventCommentCollection,
        ...additionalEventComments
      );
      expect(comp.eventCommentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const eventComment: IEventComment = { id: 456 };
      const event: IEvent = { id: 62647 };
      eventComment.event = event;

      const eventCollection: IEvent[] = [{ id: 88569 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventComment });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const eventComment: IEventComment = { id: 456 };
      const user: IUser = { id: 'daa197c6-381a-4044-a6a9-f81938ac0a1a' };
      eventComment.user = user;

      const userCollection: IUser[] = [{ id: '86d9f330-8e1a-4f7b-b683-0f01234e1d6a' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventComment: IEventComment = { id: 456 };
      const eventComment: IEventComment = { id: 53958 };
      eventComment.eventComment = eventComment;
      const event: IEvent = { id: 14282 };
      eventComment.event = event;
      const user: IUser = { id: 'b84e6449-542e-4db2-8bfc-0674dd60f2d2' };
      eventComment.user = user;

      activatedRoute.data = of({ eventComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventComment));
      expect(comp.eventCommentsSharedCollection).toContain(eventComment);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventComment>>();
      const eventComment = { id: 123 };
      jest.spyOn(eventCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventCommentService.update).toHaveBeenCalledWith(eventComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventComment>>();
      const eventComment = new EventComment();
      jest.spyOn(eventCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventComment }));
      saveSubject.complete();

      // THEN
      expect(eventCommentService.create).toHaveBeenCalledWith(eventComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventComment>>();
      const eventComment = { id: 123 };
      jest.spyOn(eventCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventCommentService.update).toHaveBeenCalledWith(eventComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEventCommentById', () => {
      it('Should return tracked EventComment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventCommentById(0, entity);
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

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
