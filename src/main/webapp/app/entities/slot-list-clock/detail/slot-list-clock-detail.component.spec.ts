import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SlotListClockDetailComponent } from './slot-list-clock-detail.component';

describe('SlotListClock Management Detail Component', () => {
  let comp: SlotListClockDetailComponent;
  let fixture: ComponentFixture<SlotListClockDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotListClockDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ slotListClock: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SlotListClockDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SlotListClockDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load slotListClock on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.slotListClock).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
