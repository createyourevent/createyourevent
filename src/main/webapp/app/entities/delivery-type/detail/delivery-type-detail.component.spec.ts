import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DeliveryTypeDetailComponent } from './delivery-type-detail.component';

describe('DeliveryType Management Detail Component', () => {
  let comp: DeliveryTypeDetailComponent;
  let fixture: ComponentFixture<DeliveryTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ deliveryType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DeliveryTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DeliveryTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load deliveryType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.deliveryType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
