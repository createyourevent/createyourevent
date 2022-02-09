import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventStarRatingDetailComponent } from './event-star-rating-detail.component';

describe('EventStarRating Management Detail Component', () => {
  let comp: EventStarRatingDetailComponent;
  let fixture: ComponentFixture<EventStarRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventStarRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventStarRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventStarRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventStarRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventStarRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventStarRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
