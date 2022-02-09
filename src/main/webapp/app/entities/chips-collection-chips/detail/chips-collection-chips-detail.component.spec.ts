import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChipsCollectionChipsDetailComponent } from './chips-collection-chips-detail.component';

describe('ChipsCollectionChips Management Detail Component', () => {
  let comp: ChipsCollectionChipsDetailComponent;
  let fixture: ComponentFixture<ChipsCollectionChipsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChipsCollectionChipsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chipsCollectionChips: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChipsCollectionChipsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChipsCollectionChipsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chipsCollectionChips on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chipsCollectionChips).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
