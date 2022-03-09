import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SlotListPlumDetailComponent } from './slot-list-plum-detail.component';

describe('SlotListPlum Management Detail Component', () => {
  let comp: SlotListPlumDetailComponent;
  let fixture: ComponentFixture<SlotListPlumDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotListPlumDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ slotListPlum: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SlotListPlumDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SlotListPlumDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load slotListPlum on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.slotListPlum).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
