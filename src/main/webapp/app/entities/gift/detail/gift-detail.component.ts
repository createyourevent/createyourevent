import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGift } from '../gift.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-gift-detail',
  templateUrl: './gift-detail.component.html',
})
export class GiftDetailComponent implements OnInit {
  gift: IGift | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gift }) => {
      this.gift = gift;
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
