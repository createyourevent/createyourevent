import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITags } from 'app/entities/tags/tags.model';
import { EventTickerService } from './event-ticker.service';

@Component({
  selector: 'jhi-event-ticker',
  templateUrl: './event-ticker.component.html',
  styleUrls: ['event-ticker.component.scss']
})
export class EventTickerComponent implements OnInit, OnDestroy {
  tags!: ITags[];
  items: any[] = [];

  constructor(private provider: EventTickerService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {}

  loadData(): void {
    this.items = this.provider.getTags();
  }
}
