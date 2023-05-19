import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CloudOptions, CloudData } from 'angular-tag-cloud-module';
import { TagsService } from 'app/entities/tags/service/tags.service';
import { ITags } from 'app/entities/tags/tags.model';
import { TagCloudService } from './tag-cloud.service';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'jhi-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['tag-cloud.component.scss'],
})
export class TagCloudComponent implements OnInit {
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 0.98,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 500,
    overflow: false,
  };

  data: CloudData[];

  // initialize a private variable _data, it's a BehaviorSubject

  constructor(private provider: TagCloudService) {}
  ngOnInit(): void {
    this.provider.load().subscribe(data => {
      this.data = data;
    });
  }
}
