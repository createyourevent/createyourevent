import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ITags } from 'app/entities/tags/tags.model';
import { EventTickerService } from './event-ticker.service';
import { CloudOptions, CloudData } from 'angular-tag-cloud-module';
import { TagsService } from 'app/entities/tags/service/tags.service';
import { Observable } from 'rxjs';
import { TagCloudService } from '../tag-cloud/tag-cloud.service';

@Component({
  selector: 'jhi-event-ticker',
  templateUrl: './event-ticker.component.html',
  styleUrls: ['event-ticker.component.scss'],
})
export class EventTickerComponent implements OnInit, OnDestroy {
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 0.98,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 500,
    overflow: false,
  };

  data: CloudData[];

  // initialize a private variable _data, it's a BehaviorSubject

  constructor(private provider: EventTickerService) {}
  ngOnInit(): void {
    this.provider.load().subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy(): void {}
}
