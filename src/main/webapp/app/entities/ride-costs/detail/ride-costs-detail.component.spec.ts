import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RideCostsDetailComponent } from './ride-costs-detail.component';

describe('RideCosts Management Detail Component', () => {
  let comp: RideCostsDetailComponent;
  let fixture: ComponentFixture<RideCostsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RideCostsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ rideCosts: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RideCostsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RideCostsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load rideCosts on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.rideCosts).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
