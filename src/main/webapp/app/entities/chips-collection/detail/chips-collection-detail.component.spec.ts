import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChipsCollectionDetailComponent } from './chips-collection-detail.component';

describe('ChipsCollection Management Detail Component', () => {
  let comp: ChipsCollectionDetailComponent;
  let fixture: ComponentFixture<ChipsCollectionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChipsCollectionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chipsCollection: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChipsCollectionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChipsCollectionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chipsCollection on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chipsCollection).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
