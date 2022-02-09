import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBond } from '../bond.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-bond-detail',
  templateUrl: './bond-detail.component.html',
})
export class BondDetailComponent implements OnInit {
  bond: IBond | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bond }) => {
      this.bond = bond;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
