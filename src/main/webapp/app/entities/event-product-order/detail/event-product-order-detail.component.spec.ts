import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventProductOrderDetailComponent } from './event-product-order-detail.component';

describe('EventProductOrder Management Detail Component', () => {
  let comp: EventProductOrderDetailComponent;
  let fixture: ComponentFixture<EventProductOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventProductOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventProductOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventProductOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventProductOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventProductOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventProductOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
