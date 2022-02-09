import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ServiceLikeDislikeDetailComponent } from './service-like-dislike-detail.component';

describe('ServiceLikeDislike Management Detail Component', () => {
  let comp: ServiceLikeDislikeDetailComponent;
  let fixture: ComponentFixture<ServiceLikeDislikeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceLikeDislikeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ serviceLikeDislike: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ServiceLikeDislikeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ServiceLikeDislikeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load serviceLikeDislike on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.serviceLikeDislike).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
