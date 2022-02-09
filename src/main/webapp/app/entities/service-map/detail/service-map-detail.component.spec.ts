import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ServiceMapDetailComponent } from './service-map-detail.component';

describe('ServiceMap Management Detail Component', () => {
  let comp: ServiceMapDetailComponent;
  let fixture: ComponentFixture<ServiceMapDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceMapDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ serviceMap: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ServiceMapDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ServiceMapDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load serviceMap on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.serviceMap).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
