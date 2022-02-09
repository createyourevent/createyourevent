jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventDetailsService } from '../service/event-details.service';
import { IEventDetails, EventDetails } from '../event-details.model';

import { EventDetailsUpdateComponent } from './event-details-update.component';

describe('EventDetails Management Update Component', () => {
  let comp: EventDetailsUpdateComponent;
  let fixture: ComponentFixture<EventDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventDetailsService: EventDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventDetailsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(EventDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventDetailsService = TestBed.inject(EventDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const eventDetails: IEventDetails = { id: 456 };

      activatedRoute.data = of({ eventDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventDetails));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventDetails>>();
      const eventDetails = { id: 123 };
      jest.spyOn(eventDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventDetailsService.update).toHaveBeenCalledWith(eventDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventDetails>>();
      const eventDetails = new EventDetails();
      jest.spyOn(eventDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventDetails }));
      saveSubject.complete();

      // THEN
      expect(eventDetailsService.create).toHaveBeenCalledWith(eventDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventDetails>>();
      const eventDetails = { id: 123 };
      jest.spyOn(eventDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventDetailsService.update).toHaveBeenCalledWith(eventDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
