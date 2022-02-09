import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventServiceMapOrderDetailComponent } from './event-service-map-order-detail.component';

describe('EventServiceMapOrder Management Detail Component', () => {
  let comp: EventServiceMapOrderDetailComponent;
  let fixture: ComponentFixture<EventServiceMapOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventServiceMapOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventServiceMapOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventServiceMapOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventServiceMapOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventServiceMapOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventServiceMapOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
