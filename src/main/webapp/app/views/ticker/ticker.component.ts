import { Component, OnInit, OnDestroy } from "@angular/core";
import { ITags } from "app/entities/tags/tags.model";
import { TickerService } from "./ticker.service";


@Component({
  selector: 'jhi-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['ticker.component.scss']
})
export class TickerComponent implements OnInit, OnDestroy {
  tags!: ITags[];
  items: any[] = [];

  constructor(private provider: TickerService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {}

  loadData(): void {
    this.items = this.provider.getTags();
  }
}
