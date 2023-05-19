import { OnInit, OnDestroy, ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { TickerService } from './ticker.service';
import { CloudOptions, CloudData } from 'angular-tag-cloud-module';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'jhi-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['ticker.component.scss'],
})
export class TickerComponent {
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 0.98,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 500,
    overflow: false,
  };

  tagsData: CloudData[];

  constructor(private tickerService: TickerService) {}

  ngOnInit() {
    this.tickerService.load().subscribe((tags: CloudData[]) => {
      this.tagsData = tags;
    });
  }
}
