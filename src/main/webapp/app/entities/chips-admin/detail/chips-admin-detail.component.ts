import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChipsAdmin } from '../chips-admin.model';

@Component({
  selector: 'jhi-chips-admin-detail',
  templateUrl: './chips-admin-detail.component.html',
})
export class ChipsAdminDetailComponent implements OnInit {
  chipsAdmin: IChipsAdmin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chipsAdmin }) => {
      this.chipsAdmin = chipsAdmin;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
