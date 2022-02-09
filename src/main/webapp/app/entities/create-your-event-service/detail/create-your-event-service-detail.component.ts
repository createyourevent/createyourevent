import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreateYourEventService } from '../create-your-event-service.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-create-your-event-service-detail',
  templateUrl: './create-your-event-service-detail.component.html',
})
export class CreateYourEventServiceDetailComponent implements OnInit {
  createYourEventService: ICreateYourEventService | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ createYourEventService }) => {
      this.createYourEventService = createYourEventService;
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
