import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SlotListCherryDetailComponent } from './slot-list-cherry-detail.component';

describe('SlotListCherry Management Detail Component', () => {
  let comp: SlotListCherryDetailComponent;
  let fixture: ComponentFixture<SlotListCherryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotListCherryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ slotListCherry: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SlotListCherryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SlotListCherryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load slotListCherry on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.slotListCherry).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
