import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventProductRatingCommentDetailComponent } from './event-product-rating-comment-detail.component';

describe('EventProductRatingComment Management Detail Component', () => {
  let comp: EventProductRatingCommentDetailComponent;
  let fixture: ComponentFixture<EventProductRatingCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventProductRatingCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventProductRatingComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventProductRatingCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventProductRatingCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventProductRatingComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventProductRatingComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
