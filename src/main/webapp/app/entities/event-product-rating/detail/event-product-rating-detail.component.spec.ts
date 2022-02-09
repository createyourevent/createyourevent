import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventProductRatingDetailComponent } from './event-product-rating-detail.component';

describe('EventProductRating Management Detail Component', () => {
  let comp: EventProductRatingDetailComponent;
  let fixture: ComponentFixture<EventProductRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventProductRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventProductRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventProductRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventProductRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventProductRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventProductRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
