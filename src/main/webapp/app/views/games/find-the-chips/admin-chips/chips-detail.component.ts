import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IChips } from 'app/entities/chips/chips.model';
import { JhiDataUtils } from 'ng-jhipster';


@Component({
  selector: 'jhi-chips-detail',
  templateUrl: './chips-detail.component.html'
})
export class ChipsDetailComponent implements OnInit {
  chips: IChips | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chips }) => (this.chips = chips));
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }
}
