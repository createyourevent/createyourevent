import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SlotListOrangeDetailComponent } from './slot-list-orange-detail.component';

describe('SlotListOrange Management Detail Component', () => {
  let comp: SlotListOrangeDetailComponent;
  let fixture: ComponentFixture<SlotListOrangeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotListOrangeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ slotListOrange: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SlotListOrangeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SlotListOrangeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load slotListOrange on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.slotListOrange).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
