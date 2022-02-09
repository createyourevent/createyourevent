import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorksheet } from '../worksheet.model';

@Component({
  selector: 'jhi-worksheet-detail',
  templateUrl: './worksheet-detail.component.html',
})
export class WorksheetDetailComponent implements OnInit {
  worksheet: IWorksheet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ worksheet }) => {
      this.worksheet = worksheet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
