import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PointsExchangeDetailComponent } from './points-exchange-detail.component';

describe('PointsExchange Management Detail Component', () => {
  let comp: PointsExchangeDetailComponent;
  let fixture: ComponentFixture<PointsExchangeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointsExchangeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pointsExchange: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PointsExchangeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PointsExchangeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pointsExchange on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pointsExchange).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
