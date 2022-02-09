import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventCommentDetailComponent } from './event-comment-detail.component';

describe('EventComment Management Detail Component', () => {
  let comp: EventCommentDetailComponent;
  let fixture: ComponentFixture<EventCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
