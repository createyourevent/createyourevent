import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventDetailsDetailComponent } from './event-details-detail.component';

describe('EventDetails Management Detail Component', () => {
  let comp: EventDetailsDetailComponent;
  let fixture: ComponentFixture<EventDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventDetails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
