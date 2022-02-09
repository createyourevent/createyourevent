import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'jhi-till',
  templateUrl: './till.component.html',
  styleUrls: ['till.component.scss']
})
export class TillComponent implements OnInit, OnDestroy, OnChanges {


  @Input() incomings = 0;
  @Input() outgoings = 0;
  @Input() investment = 0;
  cashDesk: number;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['incomings'] !== undefined) {
      this.incomings = changes['incomings'].currentValue;
      this.ngOnInit();
    }
    if (changes['outgoings'] !== undefined) {
      this.outgoings = changes['outgoings'].currentValue;
      this.ngOnInit();
    }
    if (changes['investment'] !== undefined) {
      this.outgoings = changes['investment'].currentValue;
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.totalToSpend();
  }

  ngOnDestroy(): void {
  }

  totalToSpend(): number {
    return this.incomings + this.investment;
  }

}
