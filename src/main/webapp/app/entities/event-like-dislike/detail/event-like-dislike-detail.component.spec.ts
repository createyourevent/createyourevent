import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventLikeDislikeDetailComponent } from './event-like-dislike-detail.component';

describe('EventLikeDislike Management Detail Component', () => {
  let comp: EventLikeDislikeDetailComponent;
  let fixture: ComponentFixture<EventLikeDislikeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventLikeDislikeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventLikeDislike: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventLikeDislikeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventLikeDislikeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventLikeDislike on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventLikeDislike).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
