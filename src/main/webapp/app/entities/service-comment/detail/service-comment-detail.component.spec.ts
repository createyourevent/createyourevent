import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ServiceCommentDetailComponent } from './service-comment-detail.component';

describe('ServiceComment Management Detail Component', () => {
  let comp: ServiceCommentDetailComponent;
  let fixture: ComponentFixture<ServiceCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ serviceComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ServiceCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ServiceCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load serviceComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.serviceComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
