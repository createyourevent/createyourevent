import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationCommentDetailComponent } from './organization-comment-detail.component';

describe('OrganizationComment Management Detail Component', () => {
  let comp: OrganizationCommentDetailComponent;
  let fixture: ComponentFixture<OrganizationCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organizationComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganizationCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganizationCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organizationComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organizationComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
